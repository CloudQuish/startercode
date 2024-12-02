function deleteUser(userId){
    fetch("/delete_user", {
        method: "POST",
        body: JSON.stringify({userId: userId}),
    }).then((_res)=>{
        window.location.href = "/users";
    });
}


function deleteEvent(event_id){
    fetch("/delete_event", {
        method: "POST",
        body: JSON.stringify({event_id: event_id}),
    }).then((_res)=>{
        window.location.href = "/events";
    });
}


function deleteNotification(notification_id){
    fetch("/delete_notification", {
        method: "POST",
        body: JSON.stringify({notification_id: notification_id}),
    }).then((_res)=>{
        window.location.href = "/notifications";
    });
}


function bookTickets(event_id, userId){
    tickets = document.getElementById("tickets").value;

    fetch("/book/"+event_id, {
        method: "POST",
        body: JSON.stringify({userId: userId, tickets:tickets}),
    }).then((_res)=>{
        window.location.href = "/events";
    });
}