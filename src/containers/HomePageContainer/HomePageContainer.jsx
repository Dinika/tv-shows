import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classes from './HomePageContainer.module.css';
import axios from '../../axios-tvshows';
import Loader from '../../components/UI/Loader/Loader';

let episodeList = [];
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
const plots = {};

class HomePageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tvShow: 'Silicon Valley',
      numberOfPlotsReceived: 0
    };
  }

  componentDidMount() {
    this.getTVShowEpisodes();
  }

  onTVShowNameChange(event) {
    this.setState({ tvShow: event.target.value });
  }

  onTVShowNameSubmitted() {
    this.setState({ loading: true });
    this.getTVShowEpisodes();
  }

  getTVShowEpisodes() {
    const tvShowLink = `/?apikey=86e5149f&t=${this.state.tvShow}&Season=1`;
    axios
      .get(tvShowLink)
      .then(response => {
        this.setState({ loading: false, numberOfPlotsReceived: 0 });
        episodeList = response.data.Episodes.map((episode, index) => {
          const month = +episode.Released.split('-')[1];
          this.getEpisodePlot(episode.imdbID);
          return {
            id: index + 1,
            title: episode.Title,
            plot: 'Some Plot',
            monthReleased: MONTH_NAMES[month],
            imdbRating: episode.imdbRating,
            imdbID: episode.imdbID
          };
        });

        this.setState({ loading: false });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  getEpisodePlot(imdbID) {
    const plotLink = `?apikey=86e5149f&i=${imdbID}&plot=short&r=json`;
    axios
      .get(plotLink)
      .then(response => {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const plotsNow = this.state.numberOfPlotsReceived + 1;
        this.setState({ numberOfPlotsReceived: plotsNow });
        plots[imdbID] = response.data.Plot;
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  static renderPlot(imdbID) {
    const plot = plots[imdbID] ? plots[imdbID] : 'Loading Plot';
    return plot;
  }

  render() {
    const loadingOrTable = this.state.loading ? (
      <Loader />
    ) : (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Episode Number</TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="right">Plot</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">Release Month</TableCell>
            <TableCell align="right">IMDb Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {episodeList.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="left">{row.title}</TableCell>
              <TableCell align="right">
                {this.state.numberOfPlotsReceived === episodeList.length
                  ? HomePageContainer.renderPlot(row.imdbID)
                  : 'Loading Plot'}
              </TableCell>
              <TableCell align="right">Image</TableCell>
              <TableCell align="right">{row.monthReleased}</TableCell>
              <TableCell align="right">{row.imdbRating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

    return (
      <div className={classes.MainContainer}>
        <div className={classes.InputContainer}>
          <TextField
            id="outlined-full-width"
            label="TV Show"
            style={{ margin: 8 }}
            placeholder="Example: Silicon Valley"
            margin="normal"
            variant="outlined"
            value={this.state.tvShow}
            InputLabelProps={{
              shrink: true
            }}
            onChange={this.onTVShowNameChange.bind(this)}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.onTVShowNameSubmitted.bind(this)}
          >
            Search
          </Button>
        </div>
        {loadingOrTable}
      </div>
    );
  }
}

export default HomePageContainer;
