*** Settings ***
Documentation     Verifying Birthday RSVP app is accessible and working
Library           RequestsLibrary

*** Test Cases ***
Send GET message to verify page is accessible
    ${response}=    GET  https://rsvp-app-e7za.onrender.com/
    Should Be Equal As Strings    200    ${response.status_code}

Send POST message to verify guest RSVP input works
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST  https://rsvp-app-backend-6589.onrender.com/api/guests  data={"guests":[{"name":"test","age":"adult","childAge":""}],"afterparty":true,"requirements":"test"}  headers=${headers}
    Should Be Equal As Strings    201   ${response.status_code}
    Should Be Equal As Strings    ${response.json()["message"]}    Guest added successfully
