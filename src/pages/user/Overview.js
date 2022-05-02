import { Box, Typography } from '@mui/material'
import React from 'react'
import useAuth from '../../hooks/useAuth'

export const Overview = () => {
    const { user } = useAuth()

    if(!user){
        return <div>Loading...</div>
    }
    return (
        <Box display="flex" flexDirection="column">
            <Box>
                <Typography variant="h3">{user.first_name} {user.last_name}</Typography>
            </Box>
            <Box display="flex" flexDirection="column" mt={5}>
                <Typography variant="h5">Email</Typography>
                <Typography>{user.email}</Typography>
            </Box>
        </Box>
    )
}
