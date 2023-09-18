import { React, useState } from 'react'
import data from "./ListData.json"
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate, useParams } from "react-router-dom";

function List(props) {


    let params = useParams();
    let navigate = useNavigate();

    //create a new array by filtering the original array
    const filteredData = data.filter((el) => {
        //if no input the return the original
        if (props.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            console.log("el is :")
            console.log(el)
            return el.job.toLowerCase().includes(props.input)
        }

    })

    const openProfile = (userID) => {
        navigate(`/apps/tgcd/profile/${userID}` , {"userID": userID,})
    }
    
    return (
        <ul>
            {filteredData.map((item) => (
                
                <div className='list-item'>
                        <Stack direction="row">
                            <Avatar alt={item.name} src={item.photoUrl} />
                            <li key={item.id}>{item.name} ({item.job})</li>
                            <Button variant="contained" endIcon={<SendIcon />} onClick={() => openProfile(item.id)}>
                                 Send
                            </Button>
                        </Stack>

                </div>
                
            ))}
        </ul>
    )
}

export default List