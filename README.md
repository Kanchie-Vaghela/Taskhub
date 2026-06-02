# TaskHub

TaskHub is a full-stack AI-assisted task management platform designed for content production workflows.

The platform enables administrators to create tasks, assign them to users, review AI-generated content submissions, request revisions, approve final work, and track task progress through a structured workflow.


## Features

### Admin Features

* Create tasks with product reference images
* Assign tasks to specific users
* View all platform tasks
* Review submitted image generations
* Approve completed submissions
* Request revisions with feedback
* Manage workflow through task statuses
* Receive email notifications when users submit work

### User Features

* View assigned tasks
* Generate AI image variations
* Select preferred generated images
* Submit selected images for review
* Receive revision feedback
* Track task status
* Receive email notifications for task updates


## Task Workflow

```text
Admin Creates Task
        ↓
Admin Assigns Task
        ↓
User Receives Assignment
        ↓
User Generates Images
        ↓
User Selects Images
        ↓
Submit For Review
        ↓
Admin Reviews Submission
      ↙       ↘
Revision     Approve
      ↓          ↓
User Updates   Completed
```


## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Axios

### Backend

* Flask
* Python

### Database

* Supabase PostgreSQL

### Storage

* Cloudinary

### Email Service

* Resend

### Background Processing

* Python Worker Process


## Architecture

### Frontend

The frontend provides separate interfaces for administrators and users.

#### User Dashboard

Users can:

* View assigned tasks
* Generate image variations
* Select generated images
* Submit work for review
* Track task status

#### Admin Dashboard

Administrators can:

* Manage tasks
* Review submissions
* Approve work
* Request revisions
* Monitor workflow progress

## Database Design

### Users

Stores platform users and role information.

Fields:

* id
* email
* name
* role
* created_at

### Tasks

Stores task details and workflow status.

Fields:

* id
* title
* description
* assigned_to
* created_by
* status
* review_feedback
* product_image_url

### Jobs

Stores image generation jobs.

Fields:

* id
* task_id
* status
* created_at
* completed_at

### Generated Images

Stores generated image outputs.

Fields:

* id
* task_id
* image_url
* image_type
* is_selected
* created_at

## Email Notifications

The platform automatically sends email notifications for important workflow events.
currently only task submission email is working due to resend free tier

### Task Assigned

Recipient: User

Triggered when a task is assigned.

### Task Submitted

Recipient: Admin

Triggered when a user submits selected images.

### Task Approved

Recipient: User

Triggered when an administrator approves a submission.

### Revision Requested

Recipient: User

Triggered when an administrator requests changes.

## Background Worker

TaskHub uses a dedicated worker process to handle image generation jobs.

Workflow:

```text
User Requests Generation
          ↓
Job Added To Queue
          ↓
Worker Picks Job
          ↓
Images Generated
          ↓
Results Stored
          ↓
Frontend Updates
```

## Security Features

* Role-based access control
* Rate limiting on generation endpoints
* Protected API routes
* Environment variable management
* Secure file storage

## Installation

### Clone Repository


### Backend Setup

```bash
cd backend

pip install -r requirements.txt
```

Create:

```env
SUPABASE_URL=
SUPABASE_KEY=
RESEND_API_KEY=
ADMIN_EMAIL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run:

```bash
python app.py
```

### Worker

```bash
python workers/ai_worker.py
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

## Future Improvements

* Real AI image generation integration
* Redis-backed job queue
* Real-time notifications
* Team collaboration features
* Analytics dashboard
* Approval history
* Activity logs
* Multi-stage review workflows

## Project Status

TaskHub is a production-inspired workflow management system demonstrating:

* Full-stack application development
* Background job processing
* Email automation
* Review and approval workflows
* Cloud storage integration
* Database design
* API development
* Modern React frontend architecture
* End-to-end task lifecycle management

```
```

## Known Limitations

### AI Generation Uses Simulated Outputs

The current implementation simulates AI image generation using placeholder images and a background worker process. The generation workflow, job processing, selection system, and review pipeline are fully implemented, but a production AI model has not yet been integrated.

### Email Delivery Restrictions

Email notifications are implemented using Resend. Sending emails to arbitrary recipients requires domain verification. During development, email functionality may be limited to verified recipient addresses.

### Worker Process Runs Separately

Image generation jobs require the worker service to be running. If the worker process is offline, jobs will remain in the queued state until processing resumes.

### No Redis Queue Integration

The current version uses database polling for job processing. A production-ready version would use Redis and a dedicated queue system such as BullMQ, Celery, or RQ for improved scalability and reliability.

### Limited Admin Analytics

Basic workflow management is available, but advanced analytics such as productivity metrics, generation statistics, user performance tracking, and reporting are not yet implemented.

### Simplified Review Workflow

The platform currently supports a single review stage. More complex workflows involving multiple reviewers, approval chains, and version history are not yet supported.

### Local Development URLs

Certain email templates currently contain local development URLs. These should be replaced with deployed application URLs in production environments.

### File Storage Optimization

Generated images and uploaded assets are stored using Cloudinary, but image versioning, archival policies, and storage optimization strategies have not yet been implemented.

