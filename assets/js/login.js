// simulate of saving user info in local storage

const form = document.querySelector( "form" );

if ( savedUser )
{
    const { username, password } = JSON.parse( savedUser );
    document.getElementById( "username" ).value = username || "";
    document.getElementById( "password" ).value = password || "";
}

form.addEventListener( "submit", function ( e )
{
    e.preventDefault();

    const username = document.getElementById( "username" ).value.trim();
    const password = document.getElementById( "password" ).value.trim();

    localStorage.setItem( "user", JSON.stringify( { username, password } ) );
    window.location.href = "pages/home.html";
} );


