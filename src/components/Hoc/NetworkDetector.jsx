import { Component } from 'react';
import { Alert } from 'antd';

export default function (ComposedComponent) {
  class NetworkDetector extends Component {
    state = {
      isDisconnected: false,
    };

    componentDidMount() {
      this.handleConnectionChange();
      window.addEventListener('online', this.handleConnectionChange);
      window.addEventListener('offline', this.handleConnectionChange);
    }

    componentWillUnmount() {
      window.removeEventListener('online', this.handleConnectionChange);
      window.removeEventListener('offline', this.handleConnectionChange);
    }

    handleConnectionChange = () => {
      const condition = navigator.onLine ? 'online' : 'offline';
      if (condition === 'online') {
        const webPing = setInterval(() => {
          fetch('//google.com', {
            mode: 'no-cors',
          })
            .then(() => {
              this.setState({ isDisconnected: false }, () => {
                return clearInterval(webPing);
              });
            })
            .catch(() => this.setState({ isDisconnected: true }));
        }, 2000);
        return;
      }

      return this.setState({ isDisconnected: true });
    };

    render() {
      const { isDisconnected } = this.state;
      return (
        <div>
          {isDisconnected && (
            <Alert
              message="ERROR, DUDE"
              description="No connection, no connection, unavailable movie app. Turn on 4G!"
              showIcon
              type="error"
            />
          )}
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  }

  return NetworkDetector;
}
