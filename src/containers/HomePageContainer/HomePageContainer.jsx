import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import classes from './HomePageContainer.module.css';
import axios from '../../axios-tvshows';
import Loader from '../../components/UI/Loader/Loader';

let episodeList = [];

class HomePageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tvShow: 'Silicon Valley'
    };
  }

  componentDidMount() {
    const tvShowLink = `/?apikey=86e5149f&t=${this.state.tvShow}&Season=1`;
    axios
      .get(tvShowLink)
      .then(response => {
        console.log(response.data);
        this.setState({ loading: false });
        episodeList = response.data.Episodes.map((episode, index) => ({
          id: index + 1,
          title: episode.Title,
          plot: 'Some Plot',
          monthReleased: episode.Released,
          imdbRating: episode.imdbRating
        }));

        this.setState({ loading: false });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
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
              <TableCell align="right">{row.plot}</TableCell>
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
        <TextField
          id="outlined-full-width"
          label="File Name"
          style={{ margin: 8 }}
          placeholder="Example Frozen yoghurt"
          fullWidth
          margin="normal"
          variant="outlined"
          value={this.state.tvShow}
          InputLabelProps={{
            shrink: true
          }}
        />
        {loadingOrTable}
      </div>
    );
  }
}

export default HomePageContainer;
