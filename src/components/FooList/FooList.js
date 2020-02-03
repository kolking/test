import React from 'react';
import moment from 'moment';

const randomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);

const formatTime = (datetime) => moment(datetime).format('LTS');

const formatDuration = (begin, end) => {
  const duration = moment.duration(moment(end).diff(moment(begin)));
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  return minutes > 0 ? `${minutes}m, ${seconds}s` : `${seconds}s`;
}

const FooList = ({ fooList, createFoo, toggleCompleteFoo }) => {
  const newFoo = () => {
    const speed = ['slow', 'fast', 'very fast'];
    const colour = ['blue', 'white', 'black', 'blue'];
    const size = ['tiny', 'small', 'medium', 'large', 'jumbo'];

    const fooItem = {
      speed: speed[randomIndex(speed.length)],
      colour: colour[randomIndex(colour.length)],
      size: size[randomIndex(size.length)],
      id: Math.random().toString(36).substring(7)
    }

    createFoo(fooItem.id, fooItem.colour, fooItem.size, fooItem.speed);
  }

  return (
    <section className="container">
      <hgroup className="container_header">
        <h1>List of foos</h1>
        <button type="button" onClick={newFoo}>Create New</button>
      </hgroup>
      <div className="container_content">
        {fooList && fooList.length > 0 ? (
          <ul className="foo-list">
            {fooList.map((item) => (
              <li key={item.id} className="foo-list_item">
                <time className="foo-list_item_time">
                  {formatTime(item.createdAt)}
                </time>
                <div className="foo-list_item_description">
                  {`[${item.id}] ${item.colour} - ${item.speed} - ${item.size}`}
                </div>
                {item.submittedAt ? (
                  <div className="foo-list_item_completed">
                    Completed in {formatDuration(item.createdAt, item.submittedAt)}
                  </div>
                ) : (
                  <button type="button" onClick={() => toggleCompleteFoo(item.id)}>Complete</button>
                )}
                {item.errorMessage && (
                  <div className="error" data-message={item.errorMessage} />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="container_empty">There are no foos</p>
        )}
      </div>
    </section>
  )
}

export default FooList;