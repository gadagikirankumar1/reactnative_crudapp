import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  TextInput
} from "react-native";
import PopupDialog, {
  SlideAnimation,
  DialogTitle
} from "react-native-popup-dialog";
//Database
// import { insertNewTodoList, updateTodoList } from "../database/allSchemas";
import axios from "axios";
export default class PopupDialogComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      isAddNew: true,
      visible: false
    };
  }
  //Show dialog when add new "todoList"
  showDialogComponentForAdd = () => {
    // console.log("working");
    // this.refs.popupDialog.show();
    // console.log(this.props);
    this.setState({
      dialogTitle: "Add a new TodoList",
      name: "",
      isAddNew: true,
      visible: true
    });
  };
  //Show dialog when update
  showDialogComponentForUpdate = existingTodoList => {
    // this.refs.popupDialog.show();
    this.setState({
      dialogTitle: "Update a TodoList",
      id: existingTodoList.id,
      name: existingTodoList.name,
      isAddNew: false,
      visible: true
    });
  };
  render() {
    const { dialogTitle, visible } = this.state;
    return (
      <PopupDialog
        visible={visible}
        dialogTitle={<DialogTitle title={dialogTitle} />}
        width={0.7}
        height={180}
        // ref={"popupDialog"}
      >
        <View style={styles.container}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter TodoList name"
            autoCorrect={false}
            onChangeText={text => this.setState({ name: text })}
            value={this.state.name}
          />
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (this.state.name.trim() == "") {
                  alert("Please enter todoList' name");
                  return;
                }
                this.setState({
                  visible: false
                });
                if (this.state.isAddNew == true) {
                  const newTodoList = {
                    // id: Math.floor(Date.now() / 1000),
                    creationDate: new Date(),
                    name: this.state.name
                  };
                  axios
                    .post(
                      `http://192.168.0.12/reactcrud/api/todo/create.php`,
                      newTodoList
                    )
                    .then(res => {
                      alert(res.data.message);
                      this.props.reload();
                    })
                    .catch(error => {
                      alert(error);
                    });
                } else {
                  const todoList = {
                    id: this.state.id,
                    name: this.state.name
                  };
                  axios
                    .post(
                      `http://192.168.0.12/reactcrud/api/todo/update.php`,
                      todoList
                    )
                    .then(res => {
                      alert(res.data.message);
                      this.props.reload();
                    })
                    .catch(error => {
                      alert(`Update todoList error ${error}`);
                    });
                }
              }}
            >
              <Text style={styles.textLabel}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.setState({
                  visible: false
                });
                console.log("Called Cancel, dismiss popup");
                // this.refs.popupDialog.dismiss(() => {
                //   console.log("Called Cancel, dismiss popup");
                // });
              }}
            >
              <Text style={styles.textLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PopupDialog>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    height: 40,
    padding: 10,
    margin: 10,
    borderColor: "gray",
    borderWidth: 1
  },
  button: {
    backgroundColor: "steelblue",
    padding: 10,
    margin: 10
  },
  textLabel: {
    color: "white",
    fontSize: 18
  }
});
