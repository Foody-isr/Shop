import { Box, Card, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useAuth from '../../hooks/useAuth'

export const Addresses = () => {
    const { user } = useAuth()

    const userDetails = useSelector(state => state.user.details)
    console.log("USER DETAILS", userDetails);

    useEffect(() => {

      }, [userDetails])

    if(!user || !userDetails){
        return <div>Loading...</div>
    }
    return (
        <Box display="flex" flexDirection="column">
            <Box>
                <Typography variant="h3">My Addresses</Typography>
            </Box>
            <Box display="flex" flexDirection="column" mt={5}>
                {/* <Typography variant="h5">Email</Typography>
                <Typography>{user.email}</Typography> */}
                {userDetails.addresses && userDetails.addresses.map(address => (

                        <Card >
                            <Box display="flex" flexDirection="row" justifyContent='space-between'>
                                <Typography>{address.name}</Typography>
                                <Typography>{address.address}</Typography>
                                <Typography>{address.buildingType}</Typography>
                                <Typography>{address.floor}</Typography>
                                <Typography>{address.appartment}</Typography>
                            </Box>
                        </Card>

                ))}
            </Box>
        </Box>
    )
}
