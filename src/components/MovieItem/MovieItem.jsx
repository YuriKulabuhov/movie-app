import './MovieItem.css';
import intlFormat from 'date-fns/intlFormat';
import { Card, Image, Tag, Typography, Col, Row, Rate } from 'antd';
import { Component } from 'react';
import icon from './ImageNoneDownload(1).png';
const { Title, Paragraph } = Typography;
const IMG_API = 'https://image.tmdb.org/t/p/w500';

export default class MovieItem extends Component {
  textCut = (text = 'Help us describe this movie...') => {
    if (text !== '') {
      text = text.trim();
      let limitedSymbolOverview = 155;
      if (text.length <= limitedSymbolOverview) return text;
      while (text[limitedSymbolOverview] !== ' ') {
        limitedSymbolOverview--;
      }
      if (text[limitedSymbolOverview - 1] === ',') {
        limitedSymbolOverview--;
      }
      text = text.slice(0, limitedSymbolOverview);

      return text.trim() + '...';
    }
    return 'Help us describe this movie...';
  };
  releaseData = (release_date = '') => {
    if (release_date !== '') {
      const result = intlFormat(
        new Date(Date.parse(release_date)),
        {
          day: 'numeric',
          year: 'numeric',
          month: 'long',
        },
        {
          locale: 'en-EN',
        }
      );
      return result;
    }
    return 'Secret Date';
  };
  colorRate = (rateCount) => {
    if (rateCount >= 0 && rateCount < 3) {
      return {
        color: '#E90000',
      };
    }
    if (rateCount >= 3 && rateCount < 5) {
      return {
        color: '#E97E00',
      };
    }
    if (rateCount >= 5 && rateCount < 7) {
      return {
        color: '#E9D100',
      };
    }
    if (rateCount >= 7) {
      return {
        color: '#66E900',
      };
    }
  };
  sendRateMovieItem = (count) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    const body = {
      value: count,
    };
    return fetch(
      `https://api.themoviedb.org/3/movie/${this.props.id}/rating?api_key=5bb302c89cc93b527bf971f01fac8160&guest_session_id=${this.props.guestSessionId}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers,
      }
    ).then((response) => {
      if (response.ok) {
        return;
      }
      alert(response.status);
    });
  };
  getTagGenres = (
    array1 = this.props.genre_ids,
    array2 = this.props.genresIdList
  ) => {
    let filterIds = [];
    array2.map((elem) => {
      for (let i = 0; i < array1.length; i++) {
        if (array1[i] === elem.id) {
          filterIds.push(elem);
        }
      }
      return filterIds;
    });
    return filterIds;
  };
  getTagColor = (genre) => {
    switch (genre.name[0]) {
      case 'A':
        return 'success';
      case 'C':
        return 'gold';
      case 'D':
        return 'purple';
      case 'F':
        return 'magenta';
      case 'H':
        return 'error';
      case 'M':
        return 'cyan';
      case 'R':
        return '#f888e9';
      case 'S':
        return '#2853e6';
      case 'T':
        return 'lime';
      case 'W':
        return 'volcano';
      default:
        return '#f5f7bA';
    }
  };
  render() {
    const { release_date, poster_path, title, overview, vote_average, rating } =
      this.props;
    const colorRateItem = this.colorRate(vote_average);
    this.getTagGenres();
    return (
      // <Col span={10}>
      <Card size="small">
        <Row gutter={[22, 2]} align="top" wrap={false}>
          <Col span={10}>
            <Image
              preview={false}
              width={200}
              height={300}
              src={poster_path !== null ? IMG_API + poster_path : icon}
              alt="poster"
            />
          </Col>
          <Col span={12}>
            <Typography>
              <Title level={4}>{title}</Title>
              <Paragraph>{this.releaseData(release_date)}</Paragraph>
              {this.getTagGenres().map((genre) => {
                return (
                  <Tag key={genre.id} color={this.getTagColor(genre)}>
                    {genre.name}
                  </Tag>
                );
              })}
              <Paragraph>
                <pre>{this.textCut(overview)}</pre>
              </Paragraph>
            </Typography>
            <Rate
              allowHalf
              defaultValue={rating}
              allowClear={false}
              count={10}
              onChange={(value) => {
                this.sendRateMovieItem(value);
              }}
            />
          </Col>
          <Row align="top" wrap={false}>
            <div className="rate-film" style={colorRateItem}>
              {vote_average.toFixed(1)}
            </div>
          </Row>
        </Row>
      </Card>
      // </Col>
    );
  }
}
