const API_KEY = "AIzaSyDxghyur4UN_RY2hnkB9x14MWqtTQiL-jk";
const API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${ API_KEY }`;

const chatbotButton = document.getElementById( "chatbot-button" );
const chatbotPopup = document.getElementById( "chatbot-popup" );
const closeBtn = document.getElementById( "close-btn" );
const sendBtn = document.getElementById( "send-btn" );
const userInput = document.getElementById( "user-input" );
const chatBody = document.getElementById( "chat-body" );

// Store chat history
let chatHistory = [];

// Show chatbot and hide button
chatbotButton.addEventListener( "click", () =>
{
    chatbotPopup.classList.add( "chatbot-visible" );
    chatbotButton.style.display = "none";
} );

// Close chatbot and show button
function closeChat ()
{
    chatbotPopup.classList.remove( "chatbot-visible" );
    chatbotButton.style.display = "block";
}

closeBtn.addEventListener( "click", closeChat );

// Close on click outside
document.addEventListener( "click", ( event ) =>
{
    const isClickInside = chatbotPopup.contains( event.target ) || chatbotButton.contains( event.target );
    if ( !isClickInside )
    {
        closeChat();
    }
} );

// Prevent closing when clicking inside the chat
chatbotPopup.addEventListener( "click", ( e ) =>
{
    e.stopPropagation();
} );

// Send message
sendBtn.addEventListener( "click", sendMessage );
userInput.addEventListener( "keydown", ( e ) =>
{
    if ( e.key === "Enter" ) sendMessage();
} );

function sendMessage ()
{
    const message = userInput.value.trim();
    if ( message === "" ) return;

    appendMessage( "user", message );
    chatHistory.push({ role: "user", text: message });
    userInput.value = "";
    setTimeout( () =>
    {
        getBotResponse();
    }, 500 );
}

function appendMessage ( sender, text, isHtml = false )
{
    const msg = document.createElement( "div" );
    msg.classList.add( "message", sender === "user" ? "user-message" : "bot-message" );
    if ( isHtml && sender === "bot" )
    {
        msg.innerHTML = text;
    } else
    {
        msg.textContent = text;
    }
    chatBody.appendChild( msg );
    chatBody.scrollTop = chatBody.scrollHeight;
}

async function getBotResponse()
{
    // Show animated loading dots
    appendMessage( "bot", '<span class="dot-loader"><span></span><span></span><span></span></span>', true );
    try
    {
        // Build the conversation history for the API
        const parts = chatHistory.map(msg => ({ text: msg.text }));
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "contents": [
                    {
                        "parts": parts
                    }
                ]
            })
        };
        const response = await fetch( API, requestOptions );
        const data = await response.json();
        // Remove loading message
        const loadingMsg = chatBody.querySelector( '.bot-message:last-child' );
        if ( loadingMsg && loadingMsg.querySelector( '.dot-loader' ) ) chatBody.removeChild( loadingMsg );
        if ( !response.ok )
        {
            throw new Error( `Error: ${ data.error.message }` );
        }
        // Extract the AI response text
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
        appendMessage( "bot", aiText );
        chatHistory.push({ role: "bot", text: aiText });
    } catch ( error )
    {
        // Remove loading message
        const loadingMsg = chatBody.querySelector( '.bot-message:last-child' );
        if ( loadingMsg && loadingMsg.querySelector( '.dot-loader' ) ) chatBody.removeChild( loadingMsg );
        appendMessage( "bot", "Error: " + error.message );
        chatHistory.push({ role: "bot", text: "Error: " + error.message });
    }
}
