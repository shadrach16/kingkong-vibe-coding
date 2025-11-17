## 3. Prompt Tutorial

The core of the KingKong platform is its AI-powered prompt engine. You can communicate with your backend using simple, conversational English.

### Principles of Prompting

The AI is designed to understand your intent and translate it into database queries. To get the best results, keep these principles in mind:

* **Be Specific:** The more details you provide, the better the AI's response.

    * **Bad:** `Get products.`

    * **Good:** `Get 10 products from the 'electronics' category sorted by price.`

* **Name Your Models:** Use the names of the models you created in your project (e.g., `Users`, `Blog Posts`, `Events`).

* **Use Natural Language:** Frame your requests as you would to a human data analyst.

### Common Prompt Patterns

Here are some common prompt patterns you'll use in the Figma plugin:

| Action | Example Prompt | Expected Result | 
 | ----- | ----- | ----- | 
| **Get a List** | `Get the 5 most recent blog posts and their titles.` | Returns a JSON array of 5 blog posts with title and other available fields. | 
| **Filter Data** | `Get all users who have an active subscription.` | Returns a JSON array of user objects where the subscription_status field is true. | 
| **Sort Data** | `Find the 10 most expensive products.` | Returns a JSON array of 10 products sorted by the price field in descending order. | 
| **Get Single Item** | `Get the details for the user with the email 'test@example.com'.` | Returns a single JSON object for that user. | 
| **Create/Update Data** | `Create a new blog post with the title "My First Post" and content "Hello world!".` | Returns a success message and the data for the newly created blog post. | 
| **Complex Queries** | `Find the top 5 product categories with the highest average rating and return the category name and rating.` | Returns a JSON array with complex, aggregated data. |
