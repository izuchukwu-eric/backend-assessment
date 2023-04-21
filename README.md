# Tiiny Host Backend Assessment

This is a skeleton Node.js app running on [Express].

## Instructions

You task for this assessment is to complete the `/upload` api. The code for this is in `/app/aws/upload.js`.

The upload api should take two parameters

1. A zip file
2. An email address

The api should then extract the zip file and return a 200 JSON response 

```javascript
{
    "fileCount": 0, // The number of files in the zip folder
    "largestFile": "", // The size of the largest file
    "email": "" // The email submitted in the request
}
```

For your convenience we have also added an `example.zip` file in the root of this repository.

## How to submit your solution

Simply fork this repo and commit your solution to your forked repo. Then send us the link to your repo.

## Tips

- We rate clean, well-presented code very highly
- Make sure to gracefully handle error scenarios
- You can use whatever libraries you like

## Added multer middleware to handle uploads

I used ```multer``` middleware to handle file uploads, instead of manually reading and attaching the file to the request using ```fs```. 
The ```uploadMulterMiddleware.single('uploaded-zip')``` line specifies that we expect a single file with the name ```uploaded-zip``` to be uploaded using the ```multer``` middleware

## Update made to the Upload endpoint

Upload API, we use the ```unzipper``` library to extract the uploaded zip file to a temporary directory. 
We then use the ```fs``` module to walk through the directory tree and find all the files in the extracted zip archive. 
I then loop through all the files and find the largest file by comparing their sizes.

I also added an additional error check to make sure that at least one file was found in the extracted zip archive. 
If no files are found, I throw an error and return a 400 response with an appropriate error message.

I also handle any errors that occur during the unzipping and extracting process and return a 500 response if an error occurs.

## Added a simple test file for the Upload endpoint using the example.zip file

I used the ```chai``` assertion library with the ```chai-http``` plugin to make HTTP requests 
to the app instance where the upload implementation is located.

The first test case checks that the API returns an error when no zip file is uploaded. 
The second test case checks that the API returns an error when no email is provided. 
The third test case checks that the API successfully uploads and extracts a zip file, and returns the expected response with the correct ```fileCount```, ```largestFile```, ```largestFileSize```, and ```email``` properties.

I use the ```attach``` method to attach the file to the request, 
and specify the name of the file input field as ```uploaded-zip```, 
which matches the name used in the ```multer``` middleware.
