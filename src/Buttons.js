import React from 'react';
import Button from '@material-ui/core/Button';

import './Buttons.css';

export default function CButtons() {

    const handleClick = async (type) => {
        await fetch(`${window.location.href}pixel.gif?interaction=UserClick&client=ad_media&os_name=macos&x1=${type}&x2=button&x3=main&landing_url=localhost`)
            .then((response) => {
                console.log("request completed")
            })
    }

    return (
        <div className="buttons">
            <h3>Click on your favorite button:</h3>
            <div className="buttons_body">
                <Button variant="contained" onClick={() => { handleClick('default_contained') }}>Default Contained</Button>
                <Button variant="contained" color="primary" onClick={() => { handleClick('primary_contained') }}>
                    Primary Conatined
            </Button>
                <Button variant="contained" color="secondary" onClick={() => { handleClick('secondary_contained') }}>
                    Secondary Contained
            </Button>
                <Button variant="outlined" onClick={() => { handleClick('default_outlined') }}>Default Outlined</Button>
                <Button variant="outlined" color="primary" onClick={() => { handleClick('primary_outlined') }}>
                    Primary Outlined
             </Button>
                <Button variant="outlined" color="secondary" onClick={() => { handleClick('secondary_outlined') }}>
                    Secondary Outlined
            </Button>
            </div>
        </div>
    );
}