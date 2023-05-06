// FILE ./src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
//import { generateGPTtext } from './chatGPT'; No longer needed.



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



//Full Obituary skeleton, will pass on to AWS to store it
var fullObituary = {
  name: undefined,
  dateOfBirth: undefined,
  dateOfDeath: undefined,
  gptResult: undefined, //Might not be needed on the client side?
  image: undefined,
  mp3Voiceover: undefined //Same here?? ^^^
};





export async function processObituary(createdObituary) {
  let partialObituary = await extractFormData(createdObituary);

  // Create an object with the required fields
  const obituaryData = {
    name: partialObituary.name,
    born_year: partialObituary.dateOfBirth,
    died_year: partialObituary.dateOfDeath,
    image: partialObituary.image,
    image_type: 'image/jpeg' // Replace with the actual image type
  };

  // Send obituaryData to the Lambda function using fetch
  try {
      const response = await fetch('arn:aws:apigateway:us-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:us-west-2:300608943157:function:create-obituary-daniel-30158835/invocations', {      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obituaryData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData.message);
  } catch (error) {
    console.error('Error sending obituary data:', error);
  }
 
  //return obituaryCopy;
  //Then we have to plug in the created object on the cloud to the users browser
}








//FUNCTION 2: Extracts the data from the form when the user hits "submit", you can always expect required elements bc it wont let user submit if one or more fields are missing.


export const extractFormData = async (createdObituary) => {
  //Log the data to the console
  console.log("Generated obituary:", createdObituary);

  // Extract name, dateOfBirth, and dateOfDeath, and image from the createdObituary object
  const { name, dateOfBirth, dateOfDeath, image  } = createdObituary;





  /*
  OLD CODE: the NEW GPT function will now be inside the lambda.

  // Create a formatted string using the extracted properties
  const prompt = `Write an obituary about a fictional character named ${name} who was born on ${dateOfBirth}\n and died on ${dateOfDeath}`;
  let GPTresult = await generateGPTtext(prompt);
  */






  // Create an object containing name, dateOfBirth, dateOfDeath, and GPTresult, then return it
  const obituaryData = {
    name,
    dateOfBirth,
    dateOfDeath,
    image,
    //GPTresult, No longer needed, leaving as a placeholder for old reference.
  };

  return obituaryData;
};

//DONE; recursive back to processObituary()



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
