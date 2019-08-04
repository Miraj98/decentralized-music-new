import React, { Component } from "react"
import { Grommet } from 'grommet'
import { HashRouter, Route, Switch } from 'react-router-dom'
import FirstScreen from './screens/FirstScreen'
import BrowseScreen from './screens/BrowseScreen'
import DMusic from "./contracts/DMusic.json"
import getWeb3 from "./utils/getWeb3"
import { connect } from 'react-redux'
import { storeContractInstance } from './redux/actions'
// import { Provider } from 'react-redux'
// import store from './redux/store'

const theme = {
    global: {
      font: {
        family: 'Lato',
        size: '14px',
        height: '20px',
      },
    },
  }

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    // window.AudioContext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DMusic.networks[networkId];
      const instance = new web3.eth.Contract(
        DMusic.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.props.storeContractInstance({ web3, accounts, contract: instance })
    //   this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

//   runExample = async () => {
//     const { accounts, contract } = this.state;

//     // // Stores a given value, 5 by default.
//     await contract.methods.addSong('jsdgjhsghjsdgfjhgsdf', 12).send({ from: accounts[0] });

//     // // Get the value from the contract to prove it worked.
//     // const response = await contract.methods.get().call();

//     // // Update state with the result.
//     // this.setState({ storageValue: response });
//   };

  render() {
    console.log(this.props.web3)
    if (!this.props.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        // <Provider store={store}>
            <HashRouter>
                <Grommet theme={theme} full>
                    <Switch>
                        <Route path="/" exact render={props => <FirstScreen {...props} {...this.state } />} />
                        <Route path="/browse" exact render={props => <BrowseScreen {...props}/>} />
                    </Switch>
                </Grommet>
            </HashRouter>
        // </Provider>
    );
  }
}

const mapDispatchToProps = {
    storeContractInstance
} 

const mapStateToProps = state => ({
    web3: state.web3
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default App