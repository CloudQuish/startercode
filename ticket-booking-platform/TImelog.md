# **TimeLog.md**

### **Project: Ticket Booking Platform**

This document tracks the progress and major milestones of the project.

---

| Date       | Task Description                                     | Time Spent | Notes                               |
|------------|------------------------------------------------------|------------|-------------------------------------|
| 30 Nov 2024 | Initialized FastAPI project and setup core structure | 1 hrs      |  . |
| | Configured Docker and Docker Compose                 | 30-40 min      | Added `Dockerfile` and `docker-compose.yaml`.  for api,db,redis,kafka,zookeeper|
|  | Explored stripe api     | 1 hr       | stripe python sdk,docs,weebhooks |
|  | Designed database models, Configured Alembic for database migrations,Wrote repository classes for database operations		 | 1 hr       | stripe python sdk,docs,weebhooks |


| Date       | Task Description                                     | Time Spent | Notes                               |
|------------|------------------------------------------------------|------------|-------------------------------------|
| 1 Dec 2024 | Create apis, and views , implemented  lock mechanisum for ticket using redis ,create kafaka producer and consumer  | 5-6 hrs      |   |


| Date       | Task Description                                     | Time Spent | Notes                               |
|------------|------------------------------------------------------|------------|-------------------------------------|
| 2 Dec 2024 | Debuging locking ticket and kafla message consumer processing(Debugging and logic change)   | 1 hrs      |   |
| 2 Dec 2024 |Debugging stripe ,when creating stripe session i was unable to pass my custom metadata,which will later recived from weebhook .  | 2 hrs      |   |
| 2 Dec 2024 |Tested api and whole workflow, also tested payment failed cases  using ngrok for webhooks  | 2 hrs      |   |
| 2 Dec 2024 |Implemented jwt and middleware for passing user object which is extracted from token | 30 min      |   |

---


| Date       | Task Description                                     | Time Spent | Notes                               |
|------------|------------------------------------------------------|------------|-------------------------------------|
| 2 Dec 2024 | Implemented celery for handlening background task and testing | 30 min      |   |
| 2 Dec 2024 |Miscellious | 2 hrs|   |


---
