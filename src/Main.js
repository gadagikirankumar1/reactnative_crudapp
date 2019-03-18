import React, { Component } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import axios from "axios";
import HeaderComponent from "./components/HeaderComponent";
import PopupDialogComponent from "./components/PopupDialogComponent";
import Swipeout from "react-native-swipeout";
let FlatListItem = props => {
  // alert(props);
  // console.log(props);
  const {
    itemIndex,
    id,
    name,
    creationDate,
    popupDialogComponent,
    onPressItem,
    reload
  } = props;
  showEditModal = () => {
    popupDialogComponent.showDialogComponentForUpdate({
      id,
      name
    });
  };
  showDeleteConfirmation = () => {
    Alert.alert(
      "Delete",
      "Delete a todoList",
      [
        {
          text: "No",
          onPress: () => {}, //Do nothing
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            alert(id);
            axios
              .post(
                Expo.Constants.manifest.extra.apicall + `/api/todo/delete.php`,
                { id }
              )
              .then(res => {
                // console.log(res.data);
                alert(res.data.message);
                reload();
              })
              .catch(error => {
                alert(
                  `Failed to delete todoList with id = ${id}, error=${error}`
                );
              });
          }
        }
      ],
      { cancelable: true }
    );
  };
  return (
    <Swipeout
      right={[
        {
          text: "Edit",
          backgroundColor: "rgb(81,134,237)",
          onPress: showEditModal
        },
        {
          text: "Delete",
          backgroundColor: "rgb(217, 80, 64)",
          onPress: showDeleteConfirmation
        }
      ]}
      autoClose={true}
    >
      <TouchableOpacity onPress={onPressItem}>
        <View
          style={{
            backgroundColor: itemIndex % 2 == 0 ? "powderblue" : "skyblue"
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18, margin: 10 }}>
            {name}
          </Text>
          <Text style={{ fontSize: 18, margin: 10 }} numberOfLines={2}>
            {creationDate.toString()}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeout>
  );
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoLists: []
    };
    this.reloadData();
  }
  reloadData = () => {
    axios
      .get(Expo.Constants.manifest.extra.apicall + `/api/todo/read.php`)
      .then(res =>
        res.data.data.map(mydata => ({
          id: mydata.id,
          name: mydata.name,
          creationDate: mydata.creationDate
        }))
      )
      .then(newData => this.setState({ todoLists: newData }))
      .catch(error => {
        // console.warn(error);
        alert(error);
        this.setState({ todoLists: [] });
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <HeaderComponent
          title={"Todo List"}
          hasAddButton={true}
          showAddTodoList={() => {
            this.refs.popupDialogComponent.showDialogComponentForAdd();
          }}
        />
        <FlatList
          style={styles.flatList}
          data={this.state.todoLists}
          renderItem={({ item, index }) => (
            <FlatListItem
              {...item}
              itemIndex={index}
              reload={() => {
                // alert("reload");
                this.reloadData();
              }}
              popupDialogComponent={this.refs.popupDialogComponent}
              onPressItem={() => {
                alert(`You pressed item `);
              }}
            />
          )}
          keyExtractor={item => item.id}
        />
        <PopupDialogComponent
          ref={"popupDialogComponent"}
          reload={() => {
            this.reloadData();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  flatList: {
    flex: 1,
    flexDirection: "column"
  }
});

export default Main;
