from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from .models import User, Event, Ticket, Order
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from flask_login import login_user, login_required, logout_user, current_user
import json

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                flash('Log in successful', category='success')
                login_user(user, remember=True)
                return redirect(url_for('views.events'))
            else:
                flash('Incorrect password', category='error')
        else:
            flash('Email does not exist', category='error')

    events = Event.query.filter().all()
    return render_template("login.html", user=current_user)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        role = request.form.get('role')

        if role == None:
            role = 'user'

        user = User.query.filter_by(email=email).first()

        if user:
            flash('User already exists with same email', category='error')

        elif len(name) < 1:
            flash('Name is empty', category='error')

        elif len(email) < 1:
            flash('Email is empty', category='error')

        elif password != confirm_password:
            flash('Password and Confirm password do not match', category='error')

        else:
            count_user = User.query.filter().count()
            if count_user == 0:
                role='admin'

            new_user = User(name=name, email=email, password=generate_password_hash(password, method='scrypt'), role=role)
            db.session.add(new_user)
            db.session.commit()
            flash('Account Created', category='success')
            # login_user(new_user, remember=True)
            return redirect(url_for('auth.login'))           


    return render_template("register.html", user=current_user)


@auth.route('/edit_user/<int:user_id>/', methods=['GET', 'POST'])
def edit_user(user_id):
    if request.method == 'GET':
        edit_user = User.query.filter_by(id=user_id).first()
        return render_template("edit_users.html", user=current_user, edit_user=edit_user)
    
    if request.method == 'POST':
        name = request.form.get('name')
        role = request.form.get('role')

        if role == None:
            role = 'user'

        if len(name) < 1:
            flash('Name is empty', category='error')


        else:
            edit_user = User.query.filter_by(id=user_id).first()
            edit_user.name=name
            edit_user.role=role
            db.session.commit()
            flash('User edited succesfully', category='success')
            # login_user(new_user, remember=True)
            return redirect(url_for('auth.login'))           


    return render_template("register.html", user=current_user)


@auth.route('/delete_user', methods=['POST'])
def delete_user():
    user = json.loads(request.data)
    userId = user['userId']
    user = User.query.get(userId)

    if user:
        if user.id != current_user.id:
            db.session.delete(user)
            db.session.commit()
        
        else:
            flash('Cannot delete yourself', category='error')

    return jsonify({})