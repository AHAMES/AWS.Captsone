# Serverless Book Library app

To implement this project, this project is a simple book library collection, including author information as well, this app focuses on functionality and not completeness, therefore some information that should be created in concept are left out.



# Author items

The application stores Author items, and each Author item contains the following fields:

* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of an author item (e.g. "J. R. R. Tolkien")
* `authorId` (string) - identification for the item
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a author item


# Book items
The application stores Book items, and each Book item contains the following fields:

* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a book item (e.g. "Lord of the Rings")
* `authorId` (string) - identification for the author for that item
* `bookId` (string) - identification for the item
* `genre` (string) - genre of the book
* `releaseDate` (string) - publishing year for the book
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a book item

# Review items
The application stores Review items, and each Review item contains the following fields:
This is where the worst shortcut was had, after I realised the problem in this design, I was already having problems uploading the changes, therefore this structure was kept as is
* `createdAt` (string) - date and time when an item was created
* `bookId` (string) - identification for the item
* `userId` (string) - identification for the item
* `reviewRate` (number) - the review for the book, the idea was originally to make it a real number, but after some complications, it was kept as is and the positivity or negativity of the number only mattered in the frontend


# To use the application

## frontend
You can deploy the front end application by opening the cmd/terminal, having npm installed on your machine. run the following commands
`
cd client
npm i
npm run start
`
it will take some time.

## backend
similarly open the cmd, if you want to run your own version, make sure you change the environment variables in serverless.yml, otherwise the application's backend is deployed. To redeploy, make sure you have the correct credentials on ~/aws/credentials, if you are using student account, make sure you copy paste it from the vocareum page. Afterwards run the following commands (assuming you are still on client).
`
cd ../backend
npm i
sls deploy -v
`

## testing the application 
For the backend, Postman collections were provided, import them on postman and go ahead to test.

Otherwise, you can use the frontend for immidiate testing.
Login using your favored account.
You will first enter the author's menu where you can add any author you want or edit existing authors and add their photos.

You may also use book's menu for similar purpose, the book added will have default value which you have to update manually.

Finally you can review a book by pressing either the red or green thumbs down or up button, if you press the green book button, you will find all the reviews, it was originally planned that the reviews will include written discription.

Similarly, if you press the green book button in the author's section you will see all the books written by the author.
All the users's personal reviews can be found and deleted in "My Reviews" menu. including a small statistic of what he liked of disliked.
