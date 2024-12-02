CONTACT DETAILS:
Name: Prabhat Shrestha
Email: prabhatst18@gmail.com
Phone: 9849320055
Role: Backend Developer
Address: Madhyapur Thimi, Bhaktapur, Nepal
Github: https://github.com/xebster
LinkedIn: https://www.linkedin.com/in/prabhat-shrestha-327a98338/


I was not able to fully integrate Redis, Stripe and Kafka into the project so I have implemented similar logics and functionalities to achieve the desired output.


FEATURES IN THE PROJECT:
- Ticket booking for an event that consists of locking mechanism and    payment gateways.
- Locking the tickets during payment process and limited time to book the tickets. Otherwise, the tickets are released and booking is cancelled.
- Two user roles: admin and user. Admin can add, update and delete the events and users. User can book tickets to available events.
- Notificaion system that notifies the users when new events are added and payments are processed.
- Admin dashboard that displays the number of users, total events, total tickets sold


TIME LOG:

DATE                TIME (hrs)              TASK
2024-11-30          1 hr+                   Study project requirements and project setup

2024-12-1           2 hrs+                  Databse design, Authentication and Validation
                    2 hrs+                  CRUD operations
                    4 hrs+                  Studied documentation and tried to implement Redis, Stripe and Kafka
                    2 hrs+                  Ticket locking and payment implementation

2024-12-2           2 hrs+                  Admin dashboard and notification system
                    1 hr+                   Testing and finalizing
                    1 hr+                   Documentation


HOW TO RUN THE PROJECT:
- Clone the repository from Github to local computer
- Open the folder in VS Code
- Create a virtual environment and activate it (Optional)
- Install the packages from requirements.txt using "pip install -r requirements.txt"
- Run the command "python main.py"
- Open a browser and go to the link "http://127.0.0.1:5000/"