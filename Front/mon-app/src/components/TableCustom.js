import React, {useEffect, useState} from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

//let filteredData = [];

export default function TableCustom(props) {
let optionsListed = "";

const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    console.log("useEffect TableCUstom")
    console.log(props.filter)
    console.log(props.data)
    console.log(props.data.filter((item) => item.color["id"] == props.filter))
    
    let filteredDataBis = props.data.filter((item) => props.filter == "all" || (item.color["id"] == props.filter) )
    setFilteredData(filteredDataBis)

  }, [props.filter])

  const OptionsToString = (optionsList) => {

    if(optionsList.length > 0)
    {
      let optionsArray = []

      optionsList.forEach(element => {
        optionsArray.push(element.name)
      });

      
       return optionsArray.join()
    }

  }
  
  return (
    <div id='lodging-list'>
      <TableContainer component={Paper}>
            <Table sx={{ minWidth: 150 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nom du Logement</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="right">Couleur</TableCell>
                  <TableCell align="right">Options</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">T1</TableCell>
                    <TableCell align="right"><div className={`color-block`} style={{backgroundColor:row.color["hex"]}} ></div></TableCell>
                    <TableCell align="right">{OptionsToString(row.options)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
    </div>
   
  )
}
