import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Button } from 'react-native';
import { Table, TableWrapper, Col, Cols, Cell } from 'react-native-table-component';
import { any, bool } from 'prop-types';

export default class Field extends Component <any, any>{

    // Like the main method for React Native. It all starts here
    constructor(props: any) {
        super(props);

        // Setting state that controls the data throughout the app
        this.state = this.getInitialState();
    }

    getInitialState() {
        // Table data without a ship placed. onPress => onClick that reveals that it's a miss
        const elementButton = (value: any) => ( 
            <TouchableOpacity onPress={() => this.revealCoordinate(value, 'O')}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}></Text>
                </View>
            </TouchableOpacity>
        );

        return {
            // Big multi-dimensional array of HTML 
            tableData: [
                [elementButton([0, 0]), elementButton([0, 1]), elementButton([0, 2]), elementButton([0, 3]), elementButton([0, 4]), elementButton([0, 5]), elementButton([0, 6]), elementButton([0, 7])],
                [elementButton([1, 0]), elementButton([1, 1]), elementButton([1, 2]), elementButton([1, 3]), elementButton([1, 4]), elementButton([1, 5]), elementButton([1, 6]), elementButton([1, 7])],
                [elementButton([2, 0]), elementButton([2, 1]), elementButton([2, 2]), elementButton([2, 3]), elementButton([2, 4]), elementButton([2, 5]), elementButton([2, 6]), elementButton([2, 7])],
                [elementButton([3, 0]), elementButton([3, 1]), elementButton([3, 2]), elementButton([3, 3]), elementButton([3, 4]), elementButton([3, 5]), elementButton([3, 6]), elementButton([3, 7])],
                [elementButton([4, 0]), elementButton([4, 1]), elementButton([4, 2]), elementButton([4, 3]), elementButton([4, 4]), elementButton([4, 5]), elementButton([4, 6]), elementButton([4, 7])],
                [elementButton([5, 0]), elementButton([5, 1]), elementButton([5, 2]), elementButton([5, 3]), elementButton([5, 4]), elementButton([5, 5]), elementButton([5, 6]), elementButton([5, 7])],
                [elementButton([6, 0]), elementButton([6, 1]), elementButton([6, 2]), elementButton([6, 3]), elementButton([6, 4]), elementButton([6, 5]), elementButton([6, 6]), elementButton([6, 7])],
                [elementButton([7, 0]), elementButton([7, 1]), elementButton([7, 2]), elementButton([7, 3]), elementButton([7, 4]), elementButton([7, 5]), elementButton([7, 6]), elementButton([7, 7])],
            ],
        }
    }

    // Placement of ship piece
    selectShipCell(value: any) {
        // Local copy of table
        let updatedTable = this.state.tableData;
        updatedTable[value[0]][value[1]] = this.shipFactory(value);

        // Update state to hold the ship piece ('X')
        this.setState({tableData: updatedTable});
    }

    // When a coordinate is selected by the player
    revealCoordinate(value: any, isHit: any) {
        // Local copy
        let updatedTable = this.state.tableData;

        // Set coordinate value equal to character passed in ('O')
        updatedTable[value[0]][value[1]] = isHit;
        this.setState({tableData: updatedTable});
    }

    // Formats what should be in the table slot when a ship piece exists on the coordinate
    //  To visualize, we use an X. Eventually, we will use an HTML element that hides the ship piece
    shipFactory(value: any){
        return 'X';
        // return <TouchableOpacity onPress={() => this.revealCoordinate(value, 'H')}> 
        //     <View style={styles.btn}>
        //         <Text style={styles.btnText}></Text>
        //     </View>
        // </TouchableOpacity>
    }

    // Called when user clicks button 
    placeShips(){
         this.setState(this.getInitialState(), () => { // State is asynchronous (!?)
            this.placeVerticalShip(3);    // This is an anonomous function called after
            this.placeHorizontalShip(3);  //    state finishes updating
            this.placeVerticalShip(2);
            this.placeHorizontalShip(4);
        });
    }


    // We have one for Horizontal and one for Vertical. This can definitely be refactored
    //   Pass in size of ship
    placeHorizontalShip(size: Number) {
        /// Random number between 0 and size of data table
        let yAxis = (Math.floor(Math.random() * Math.floor(this.state.tableData.length)));
        let xAxis = (Math.floor(Math.random() * Math.floor(this.state.tableData.length)));
        let randomCoordinates = [xAxis, yAxis]
        let coordinateArray = [];

        // Loop depending on how long the ship is. Nothing is placed unless the ship fits
        for (let i=0; i < size; i++) {
            // If it's expanding off the size of the grid
            if(xAxis + i > this.state.tableData.length - 1){
                // Try again but vertically. 
                this.placeVerticalShip(size);
                return;
            } 
            // Check if the slot already has a ship piece
            if(typeof this.state.tableData[xAxis + i][yAxis] === 'string'){
                this.placeVerticalShip(size);
                return; 
            } else {
                // If the coordinate is good, push it onto an array of coordinates
                coordinateArray.push([xAxis + i, yAxis])
            }
        }

        // Place the ship on the grid with proper coordinates
        coordinateArray.map((coordinate) => {
            this.selectShipCell(coordinate);
        });
    }


    // Same as above but vertical. These can be combined (somehow)
    placeVerticalShip(size: Number) {
        let yAxis = (Math.floor(Math.random() * Math.floor(this.state.tableData.length)));
        let xAxis = (Math.floor(Math.random() * Math.floor(this.state.tableData.length)));
        let randomCoordinates = [xAxis, yAxis]
        let coordinateArray = [];
        for (let i=0; i < size; i++) {
            if(typeof this.state.tableData[xAxis][yAxis + i] === 'string'){
                this.placeHorizontalShip(size);
                return;
            }
            if(yAxis + i > 7){
                this.placeHorizontalShip(size);
                return;
            } else {
                coordinateArray.push([xAxis, yAxis + i])
            }
        }
        coordinateArray.map((coordinate) => {
            this.selectShipCell(coordinate);
        });
    }

    // This function displays the HTML
    render() {
        return (
            <View style={styles.container}>
                <Table style={{ flexDirection: 'row' }} borderStyle={{ borderWidth: 1 }}>
                    <TableWrapper style={{ flex: 1 }}>
                        {/* In React Native, you can just pass an array to the table and it populates */}
                        <Cols data={this.state.tableData} heightArr={[40, 40, 40, 40, 40, 40, 40, 40]} textStyle={styles.symbol} />
                    </TableWrapper>
                </Table>
                <Button onPress={() => this.setState(this.getInitialState())} title="Reset Game"/>
                <Button onPress={() => this.placeShips()} title="Place Ships"/>
            </View>
        )
    }
}

// CSS
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    symbol: { textAlign: 'center', fontSize: 50 },
    btn: { width: 'auto', height: 'auto', paddingTop: 20},
    btnText: { textAlign: 'center' },
});