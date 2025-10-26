# model/questions_db.py

QUESTION_DB = {
    "software development": {
        "frontend": [
            {
                "question": "What is the virtual DOM in React?",
                "ideal": "The virtual DOM is a lightweight copy of the real DOM used by React to optimize updates. React updates the virtual DOM first, compares it with the previous version, and then updates only the changed elements in the real DOM."
            },
            {
                "question": "Explain the difference between CSS Grid and Flexbox.",
                "ideal": "CSS Grid is used for 2D layouts (rows and columns) while Flexbox is for 1D layouts (row or column). Grid handles complex designs better, Flexbox is simpler for single-axis alignment."
            },
            {
                "question": "What are hooks in React?",
                "ideal": "Hooks are functions in React that let you use state and lifecycle features in functional components, such as useState, useEffect, and useContext."
            },
            {
                "question": "How do you optimize a React application?",
                "ideal": "Optimizations include using React.memo, lazy loading components, code splitting, avoiding unnecessary re-renders, and optimizing state management."
            },
            {
                "question": "Explain event bubbling in JavaScript.",
                "ideal": "Event bubbling is a process where an event starts from the deepest element and propagates up through the parent elements unless stopped with event.stopPropagation()."
            }
        ],
        "backend": [
            {
                "question": "What is REST and how do you design RESTful APIs?",
                "ideal": "REST (Representational State Transfer) is an architectural style for APIs using HTTP methods (GET, POST, PUT, DELETE). RESTful APIs are stateless, scalable, and designed around resources with meaningful endpoints."
            },
            {
                "question": "Explain middleware in Express.js.",
                "ideal": "Middleware are functions in Express that execute during the request-response cycle. They can modify requests/responses, handle authentication, logging, or error handling."
            },
            {
                "question": "What is the difference between SQL and NoSQL databases?",
                "ideal": "SQL databases are relational, use structured tables, and support ACID transactions. NoSQL databases are non-relational, flexible, and suitable for unstructured or large-scale data."
            },
            {
                "question": "How do you handle authentication and authorization?",
                "ideal": "Authentication verifies user identity (e.g., JWT, OAuth), while authorization checks if the user has permission to access specific resources or actions."
            },
            {
                "question": "What is caching and why is it important?",
                "ideal": "Caching stores frequently accessed data temporarily to reduce latency and server load. It's important for faster responses and optimized resource usage."
            }
        ],
        "full stack": [
            {
                "question": "Explain how frontend and backend communicate.",
                "ideal": "Frontend communicates with backend via HTTP requests, usually REST APIs or GraphQL, exchanging data in formats like JSON or XML."
            },
            {
                "question": "What is MVC architecture?",
                "ideal": "MVC stands for Model-View-Controller, a design pattern separating data (Model), UI (View), and business logic (Controller) for organized, maintainable code."
            },
            {
                "question": "How do you manage state in a full-stack app?",
                "ideal": "State can be managed on frontend using tools like Redux or Context API and persisted on backend in databases or sessions."
            },
            {
                "question": "Explain API versioning.",
                "ideal": "API versioning ensures backward compatibility when updating APIs, using URL paths (/v1/resource), headers, or query parameters."
            },
            {
                "question": "How do you handle error logging in full-stack apps?",
                "ideal": "Use logging libraries (like Winston, Log4j), structured logs, and monitoring tools to track errors in frontend and backend, often reporting to dashboards."
            }
        ],
        "mern stack": [
            {
                "question": "What is the MERN stack?",
                "ideal": "MERN stands for MongoDB, Express.js, React, and Node.js. It's a full-stack JavaScript framework for building modern web applications."
            },
            {
                "question": "Explain CRUD operations in MongoDB.",
                "ideal": "CRUD stands for Create, Read, Update, Delete. MongoDB supports these operations on documents using insertOne, find, updateOne, deleteOne methods."
            },
            {
                "question": "How does Express handle routing?",
                "ideal": "Express routes HTTP requests to specific handler functions using app.get, app.post, router, and middleware for modular routing."
            },
            {
                "question": "How do you connect React frontend with Node backend?",
                "ideal": "React sends HTTP requests (fetch or axios) to Node/Express APIs. Backend processes requests, interacts with database, and sends JSON responses back."
            },
            {
                "question": "What is JWT and how is it used in MERN apps?",
                "ideal": "JWT (JSON Web Token) is used for authentication. Server issues a token on login, which client stores and sends with requests to authorize access."
            }
        ],
        "mobile development": [
            {
                "question": "What is the difference between native and cross-platform apps?",
                "ideal": "Native apps are built for a specific OS using its SDK, while cross-platform apps use frameworks like React Native to run on multiple platforms with shared code."
            },
            {
                "question": "Explain the lifecycle of a React Native component.",
                "ideal": "Lifecycle methods include mounting, updating, and unmounting. Hooks like useEffect can manage side effects during these phases."
            },
            {
                "question": "How do you optimize performance in mobile apps?",
                "ideal": "Optimize rendering, reduce unnecessary re-renders, lazy load resources, use FlatList/RecyclerView, and manage memory efficiently."
            },
            {
                "question": "What is asynchronous programming in mobile apps?",
                "ideal": "Asynchronous programming handles tasks like API calls without blocking UI, using async/await, Promises, or callbacks."
            },
            {
                "question": "How do you handle offline data in mobile apps?",
                "ideal": "Use local storage, SQLite, or caching strategies to persist data when offline and sync when connectivity is restored."
            }
        ]
    },
    "devops": {
        "aws devops": [
            {
                "question": "Explain EC2, S3, and Lambda in AWS.",
                "ideal": "EC2 provides virtual servers, S3 is scalable object storage, and Lambda allows serverless code execution without managing servers."
            },
            {
                "question": "What is CloudFormation?",
                "ideal": "CloudFormation is AWS service to define and provision infrastructure as code using templates."
            },
            {
                "question": "How do you set up CI/CD pipelines in AWS?",
                "ideal": "CI/CD pipelines can be set up using AWS CodePipeline, CodeBuild, and CodeDeploy for automated building, testing, and deployment."
            },
            {
                "question": "Explain auto-scaling in AWS.",
                "ideal": "Auto-scaling automatically adjusts the number of EC2 instances based on load to maintain performance and cost efficiency."
            },
            {
                "question": "What is IAM and how do you manage roles?",
                "ideal": "IAM (Identity and Access Management) controls access to AWS resources using users, groups, and roles with specific permissions."
            }
        ],
        "azure devops": [
            {
                "question": "What are Azure Pipelines?",
                "ideal": "Azure Pipelines is a service to create CI/CD pipelines for automated build, test, and deployment."
            },
            {
                "question": "Explain Infrastructure as Code (IaC) in Azure.",
                "ideal": "IaC lets you define cloud infrastructure using code templates like ARM or Terraform for consistency and automation."
            },
            {
                "question": "How do you monitor resources in Azure?",
                "ideal": "Use Azure Monitor, Log Analytics, and Application Insights to track resource performance, errors, and logs."
            },
            {
                "question": "What is Azure DevTest Labs?",
                "ideal": "Azure DevTest Labs helps developers quickly provision test environments in Azure while minimizing cost."
            },
            {
                "question": "How do you implement CI/CD in Azure DevOps?",
                "ideal": "Use Azure Pipelines to automate build, test, and deployment workflows for applications."
            }
        ],
        "kubernetes": [
            {
                "question": "What is a pod in Kubernetes?",
                "ideal": "A pod is the smallest deployable unit in Kubernetes, containing one or more containers that share storage and network."
            },
            {
                "question": "Explain services in Kubernetes.",
                "ideal": "Services expose pods to network requests and provide load balancing between pods."
            },
            {
                "question": "What is a deployment?",
                "ideal": "Deployment manages pods and replica sets, ensuring the desired number of pods are running."
            },
            {
                "question": "How do you scale an application in Kubernetes?",
                "ideal": "Use kubectl scale or Horizontal Pod Autoscaler to adjust the number of pods based on demand."
            },
            {
                "question": "What are ConfigMaps and Secrets?",
                "ideal": "ConfigMaps store configuration data, and Secrets store sensitive information like passwords or keys."
            }
        ]
        # Add CI/CD Pipelines and IaC similarly...
    },
    "data science": {
        "machine learning": [
            {
                "question": "What is supervised vs unsupervised learning?",
                "ideal": "Supervised learning uses labeled data to train models, unsupervised learning finds patterns in unlabeled data."
            },
            {
                "question": "Explain overfitting and underfitting.",
                "ideal": "Overfitting occurs when a model learns noise instead of patterns; underfitting occurs when a model is too simple to capture trends."
            },
            {
                "question": "What is a confusion matrix?",
                "ideal": "A confusion matrix is a table used to evaluate classification models, showing true positives, false positives, true negatives, and false negatives."
            },
            {
                "question": "How do you choose hyperparameters?",
                "ideal": "Use techniques like grid search, random search, or Bayesian optimization to select the best hyperparameters."
            },
            {
                "question": "What is cross-validation?",
                "ideal": "Cross-validation splits data into training and validation sets multiple times to evaluate model performance reliably."
            }
        ]
        # Add other Data Science specializations similarly...
    }
}
