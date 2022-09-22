import React from "react";
import { useRouteError } from "react-router-dom";


export default function(){
    const error = useRouteError()
    console.error(error);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error occured.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}