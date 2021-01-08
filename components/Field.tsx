import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Button } from 'react-native';
import { Table, TableWrapper, Col, Cols, Cell } from 'react-native-table-component';
import { any, bool } from 'prop-types';

export default class Field extends Component <any, any>{
    constructor(props: any) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const elementButton = (value: any) => ( 
            <TouchableOpacity onPress={() => this.revealCoordinate(value, 'O')}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}></Text>
                </View>
            </TouchableOpacity>
        );

        return {
            turnHolder: 'X',
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
            winner: undefined,
            numTries: 0,
        }
    }

    selectShipCell(value: any) {
        let updatedTable = this.state.tableData;
        updatedTable[value[0]][value[1]] = this.shipFactory(value);
        this.setState({tableData: updatedTable});
        this.doWeHaveAWinner();
    }

    revealCoordinate(value: any, isHit: any) {
        let updatedTable = this.state.tableData;
        updatedTable[value[0]][value[1]] = isHit;
        this.setState({tableData: updatedTable});
    }

    doWeHaveAWinner() {
        // if(this.state.winner){
        //     return;
        // };

        // let table = this.state.tableData;
        // for (let i = 0; i < table[0].length; i++) {
        //     let horizontalWin = table[i][0] === table[i][1] && table[i][0] === table[i][2];
        //     let verticalWin = table[0][i] === table[1][i] && table[0][i] === table[2][i];
        //     if (horizontalWin || verticalWin) {
        //         Alert.alert(`${this.state.turnHolder} wins!!`);
        //         this.setState({winner: this.state.turnHolder});
        //     }
        // }

        // let mid = table[1][1];
        // if ((mid === table[0][0] && mid === table[2][2]) || (mid === table[0][2] && mid === table[2][0])) {
        //     Alert.alert(`${this.state.turnHolder} wins!!`);
        //     this.setState({winner: this.state.turnHolder});
        // }
    }

    shipFactory(value: any){
        return <TouchableOpacity onPress={() => this.revealCoordinate(value, 'H')}>
            <View style={styles.btn}>
                <Text style={styles.btnText}>X</Text>
            </View>
        </TouchableOpacity>
    }

    placeShips(){
         this.setState(this.getInitialState(), () => {
            this.placeVerticalShip(3);
            this.placeHorizontalShip(3);
            this.placeVerticalShip(2);
            this.placeHorizontalShip(4);
        });
    }

    placeHorizontalShip(size: Number) {
        let yAxis = (Math.floor(Math.random() * Math.floor(this.state.tableData.length)));
        let xAxis = (Math.floor(Math.random() * Math.floor(this.state.tableData.length)));
        let randomCoordinates = [xAxis, yAxis]
        let coordinateArray = [];
        for (let i=0; i < size; i++) {
            if(xAxis + i > 7){
                console.log('We gonna go vertical');
                this.placeVerticalShip(size);
                return;
            } 
            if(typeof this.state.tableData[xAxis + i][yAxis] === 'string'){
                console.log('CONFLICT');
                this.placeVerticalShip(size);
                return;
            } else {
                coordinateArray.push([xAxis + i, yAxis])
            }
        }
        coordinateArray.map((coordinate) => {
            this.selectShipCell(coordinate);
        });

        console.log('horizontal', randomCoordinates)  
    }

    placeVerticalShip(size: Number) {
        let yAxis = (Math.floor(Math.random() * Math.floor(this.state.tableData.length)));
        let xAxis = (Math.floor(Math.random() * Math.floor(this.state.tableData.length)));
        let randomCoordinates = [xAxis, yAxis]
        let coordinateArray = [];
        for (let i=0; i < size; i++) {
            if(typeof this.state.tableData[xAxis][yAxis + i] === 'string'){
                console.log('CONFLICT');
                this.placeHorizontalShip(size);
                return;
            }
            if(yAxis + i > 7){
                console.log('We gonna go horizontal');
                this.placeHorizontalShip(size);
                return;
            } else {
                coordinateArray.push([xAxis, yAxis + i])
            }
        }
        coordinateArray.map((coordinate) => {
            this.selectShipCell(coordinate);
        });
        console.log('vertical', randomCoordinates)  
    }

    displayText(){
       return this.state.winner ? <Text>{this.state.winner} won!</Text> : <Text>It's {this.state.turnHolder}'s turn</Text>   
    }

    render() {
        return (
            <View style={styles.container}>
                {this.displayText()}
                <Table style={{ flexDirection: 'row' }} borderStyle={{ borderWidth: 1 }}>
                    <TableWrapper style={{ flex: 1 }}>
                        <Cols data={this.state.tableData} heightArr={[40, 40, 40, 40, 40, 40, 40, 40]} textStyle={styles.symbol} />
                    </TableWrapper>
                </Table>
                <Button onPress={() => this.setState(this.getInitialState())} title="Reset Game"/>
                <Button onPress={() => this.placeShips()} title="Place Ships"/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    symbol: { textAlign: 'center', fontSize: 50 },
    btn: { width: 'auto', height: 'auto', paddingTop: 20},
    btnText: { textAlign: 'center' },
});