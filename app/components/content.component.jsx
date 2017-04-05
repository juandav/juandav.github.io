import React from 'react';

import { Note } from './note/note.component.jsx';

export class Content extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      img: 'https://avatars0.githubusercontent.com/u/12274145?v=3&s=460',
      name: 'Juan David',
      sub: 'Javascript Ninja',
      bio: 'Lived all my life on the top of mount Fuji, learning the way to be a Ninja Dev.',
      skills: [{
        icon: 'python',
        title: 'A markov chain: predict text'
      }, {
        icon: 'nodejs',
        title: 'Many projects: Libraries npm, APIs, sites, tutorials...'
      }, {
        icon: 'javascript_badge',
        title: 'Almost everything i could imagine'
      }, {
        icon: 'github',
        title: 'My favorite social network'
      }, {
        icon: 'npm',
        title: 'Many libraries for NodeJS'
      }, {
        icon: 'linux',
        title: 'My favorite SO'
      }, {
        icon: 'terminal',
        title: 'My best friend'
      }]
    };
  }

  render() {
    return (
      <div className="content tooltip">
        <div className="card">
          <div className="firstinfo">
            <img src={this.state.img} />
            <div className="profileinfo">
              <h1>{this.state.name}</h1>
              <h3>{this.state.sub}</h3>
              <p className="bio">{this.state.bio}</p>

              <div className="container">
                <button className="btn"><span>Profiles</span><i className="material-icons">public</i>
                  <ul className="dropdown">
                    <li className="active">
                      <a href="https://www.npmjs.com/~juandav" target="blank">NPM</a>
                    </li>
                    <li>
                      <a href="https://github.com/juandav" target="blank">Github</a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/channel/UCEhqocLIUf4eZgUaMKMIEYw" target="blank">Youtube</a>
                    </li>
                  </ul>
                </button>
              </div>

            </div>
          </div>
        </div>
        <div className="badgescard">
          {
            this.state.skills.map((skill, i) => {
              return <Note key={i} icon={skill.icon} title={skill.title} />;
            })
          }
        </div>
      </div>
    );
  }
}
