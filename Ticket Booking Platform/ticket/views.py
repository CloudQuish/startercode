from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from flask_login import login_required, current_user
from .models import User, Event, Ticket, Order, Notification
from datetime import datetime
from . import db
import json


views = Blueprint('views', __name__)

# @views.route('/home')
# @login_required
# def home():
#     events = Event.query.filter().all()
#     return render_template("home.html", user=current_user, events=events)

@views.route('/dashboard')
@login_required
def dashboard():
    total_users = User.query.filter().count()
    admin = User.query.filter_by(role='admin').count()
    user_count = User.query.filter_by(role='user').count()

    events = Event.query.filter().count()

    total_events = Event.query.filter().all()
    tickets = 0
    cost = 0

    for event in total_events:
        tickets = tickets + event.total_tickets
        cost = cost + (event.total_tickets * event.price)

    orders = Order.query.filter().all()

    sold_tickets = 0
    amount = 0

    for order in orders:
        sold_tickets = sold_tickets + order.number_of_tickets
        amount = amount + order.amount
    

    data=[total_users,admin,user_count,events,tickets,cost,sold_tickets,amount]

    return render_template("dashboard.html", user=current_user, data=data)

@views.route('/users')
@login_required
def users():
    users = User.query.filter().all()
    return render_template("users.html",  user=current_user, users=users)

@views.route('/')
@views.route('/events')
@login_required
def events():
    events = Event.query.filter().all()
    return render_template("events.html", user=current_user, events=events)

@views.route('/add_event', methods=['GET', 'POST'])
@login_required
def add_event():
    if request.method == 'POST':
        name = request.form.get('name')
        date = request.form.get('date')
        venue = request.form.get('venue')
        price = request.form.get('price')
        total_tickets = request.form.get('total_tickets')

        if len(name) < 1:
            flash('Name is empty', category='error')

        elif date == '':
            flash('Date is empty', category='error')

        elif len(venue) < 1:
            flash('Venue is empty', category='error')

        elif len(price) < 1:
            flash('Price is empty', category='error')

        elif len(total_tickets) < 1:
            flash('Tickets is empty', category='error')

        else:
            date = datetime.strptime(date, "%Y-%m-%d")
            if date < datetime.today():
                flash('Date is in the past', category='error')

            new_event = Event(name=name, date=date, venue=venue, price=price, total_tickets=total_tickets)
            db.session.add(new_event)
            db.session.commit()

            selected_event = Event.query.filter(Event.name==name, Event.date==date, Event.venue==venue, Event.price==price, Event.total_tickets==total_tickets).first()

            for _ in range(selected_event.total_tickets):
                ticket = Ticket(event_id=selected_event.id, status='Available')
                db.session.add(ticket)              
                db.session.commit()

            users = User.query.filter().all()
            text = 'New event '+ name + ' has been created for '+ str(date) + ' at ' + venue + '. Please book the tickets quickly.'

            for user in users:
                new_notification = Notification(user_id=user.id, notification=text, topic='Event')
                db.session.add(new_notification)
                db.session.commit()

            flash('Event added', category='success')
            return redirect(url_for('views.events'))  
        
    return render_template("events/add_event.html", user=current_user)

@views.route('/edit_event/<int:event_id>/', methods=['GET', 'POST'])
@login_required
def edit_event(event_id):
    if request.method == 'GET':
        event = Event.query.filter_by(id=event_id).first()
        event.date = event.date.strftime('%Y-%m-%d')
        return render_template("events/edit_event.html", user=current_user, event=event)


    if request.method == 'POST':
        name = request.form.get('name')
        date = request.form.get('date')
        venue = request.form.get('venue')
        price = request.form.get('price')
        total_tickets = request.form.get('total_tickets')
        add_tickets = request.form.get('add_tickets')

        if len(name) < 1:
            flash('Name is empty', category='error')

        elif date == '':
            flash('Date is empty', category='error')

        elif len(venue) < 1:
            flash('Venue is empty', category='error')

        elif len(price) < 1:
            flash('Price is empty', category='error')

        elif len(total_tickets) < 1:
            flash('Tickets is empty', category='error')

        else:
            date = datetime.strptime(date, "%Y-%m-%d")
            if date < datetime.today():
                flash('Date is in the past', category='error')

            event = Event.query.filter_by(id=event_id).first()
            event.name = name
            event.date = date
            event.venue = venue
            event.price=price
            event.total_tickets = int(total_tickets) + int(add_tickets)

            db.session.commit()

            if add_tickets != 0:
                selected_event = Event.query.filter(name==name, date==date, venue==venue, price==price, total_tickets==total_tickets).first()

                for _ in range(int(add_tickets)):
                    ticket = Ticket(event_id=selected_event.id)
                    db.session.add(ticket)
            
                db.session.commit()
            flash('Event updated', category='success')
            return redirect(url_for('views.events'))  
        
    return render_template("events/add_event.html", user=current_user)


@views.route('/delete_event', methods=['POST'])
def delete_event():
    event = json.loads(request.data)
    event_id = event['event_id']
    search_event = Event.query.filter_by(id=event_id).first()

    if search_event:
        db.session.delete(search_event)
        db.session.commit()

    return jsonify({})


@views.route('/success')
@login_required
def success():
    return render_template("success.html", user=current_user)


@views.route('/failed/<int:event_id>/')
@login_required
def failed(event_id):
    no_of_tickets = request.args.get('no_of_tickets')
    available_tickets = Ticket.query.filter(Ticket.event_id==event_id).limit(no_of_tickets).all()
    event = Event.query.filter_by(id=event_id).first()

    for ticket in available_tickets:
        ticket.status = 'Available'
        db.session.commit()

    if no_of_tickets is None:
        text = 'Payment failed for tickets for '+ event.name + ' at ' + event.venue + ' on '+ str(event.date)

    else:
        text = 'Payment failed for '+ no_of_tickets + ' tickets for '+ event.name + ' at ' + event.venue + ' on '+ str(event.date)

    new_notification = Notification(user_id=current_user.id, notification=text, topic='Ticket')
    db.session.add(new_notification)
    db.session.commit()

    return render_template("failed.html", user=current_user)


@views.route('/events/<int:event_id>/book', methods=['GET'])
@login_required
def book_ticket(event_id):
    event = Event.query.filter_by(id=event_id).first()
    tickets = Ticket.query.filter_by(event_id=event_id, status="Available").count()
    return render_template("book_tickets.html", user=current_user, event=event, tickets=tickets)
  

@views.route('/payment/<int:event_id>', methods=['GET','POST'])
@login_required
def payment(event_id):
    if request.method == 'GET':
        no_of_tickets = request.args.get('no_of_tickets')
        gateway = request.args.get('gateway')
        event = Event.query.filter_by(id=event_id).first()
        total = float(no_of_tickets) * event.price
        available_tickets = Ticket.query.filter(Ticket.event_id==event_id, Ticket.status=='Available').limit(no_of_tickets).all()
        
        for ticket in available_tickets:
            ticket.status = 'Locked'
            db.session.commit()

        return render_template("payment.html", user=current_user, event=event , no_of_tickets=no_of_tickets, total=total, gateway=gateway)

    if request.method == 'POST':
        no_of_tickets = request.args.get('no_of_tickets')
        gateway = request.args.get('gateway')
        event = Event.query.filter_by(id=event_id).first()
        total = float(no_of_tickets) * event.price
        available_tickets = Ticket.query.filter(Ticket.event_id==event_id).limit(no_of_tickets).all()

        for ticket in available_tickets:
            ticket.status = 'Booked'
            db.session.commit()

        new_order = Order(user_id=current_user.id, event_id=event.id, status='Booked', number_of_tickets = no_of_tickets, amount = total, gateway = gateway)
        db.session.add(new_order)
        db.session.commit()

        text = 'Payment successful. You booked '+ no_of_tickets + ' tickets for '+ event.name + ' at ' + event.venue + ' on '+ str(event.date) +'. Payment done through '+ gateway +'.'

        new_notification = Notification(user_id=current_user.id, notification=text, topic='Ticket')
        db.session.add(new_notification)
        db.session.commit()

        return redirect(url_for('views.success'))
    

@views.route('/notifications')
@login_required
def notification():
    notifications = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.id.desc()).all()
    return render_template("notification.html", user=current_user, notifications=notifications)


@views.route('/delete_notification', methods=['POST'])
def delete_notification():
    notification = json.loads(request.data)
    notification_id = notification['notification_id']
    notification = Notification.query.get(notification_id)

    if notification:
        db.session.delete(notification)
        db.session.commit()

    return jsonify({})