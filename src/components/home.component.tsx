import { Component } from "react";

type Props = {};

type State = {
  content: string;
}

export default class Home extends Component<Props, State> {

  render() {
    return (
      <div id="home-video">
				<video autoPlay muted loop id="bg-video">
					<source src="./assets/images/The New Life 1_1.mp4" type="video/mp4"/>
				</video>
			</div>
    );
  }
}
