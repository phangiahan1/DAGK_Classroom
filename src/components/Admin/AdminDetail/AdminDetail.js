import * as React from 'react';
import { Box } from '@mui/material';
import { Avatar } from '@mui/material';
import "./styleCreate.css";
export default function AdminDetail(data) {
  return (
    <div>
      <div id="detailAdmin-box">
            <div class="left">
                <Avatar
                    src={data.data.picture}
                    alt={data.data.email}
                    sx={{ width: 130, height: 130 }}
                />
            </div>
            <div class="right_detail">
            
            <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                    Email: {data.data.email}
                </Box>
                <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                    Name:{data.data.username}
                </Box>
                <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                    Create at:{data.data.createdAt}
                </Box>
                <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                    Update at:{data.data.updatedAt}
                </Box>
                {data.data.studentId?(
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                        StudentId:{data.data.studentId}
                    </Box>
                ):(
                    <div></div>
                )
                }
            </div>
        </div>
    </div>
  );
}