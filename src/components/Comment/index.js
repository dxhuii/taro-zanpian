import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'

import A from '@/components/A'

import './style.scss'

class Comment extends Component {
  static defaultProps = {
    data: []
  }
  static propTypes = {
    data: PropTypes.array
  }

  render() {
    const { data = [] } = this.props
    return (
      <View styleName='comment'>
        <div styleName='comment-list'>
          {data.length < 0 ? (
            <div styleName='comment-empty' className='tac'>
              暂无评论，抢少发
            </div>
          ) : (
            <ul styleName='comment-list__list' className='mt20'>
              {data.map(item => (
                <li key={item.cm_id}>
                  <div styleName='commit-list__people'>
                    <div styleName='avatar'>
                      <img src={item.avatar} />
                      {item.nickname}
                    </div>
                    <div styleName='commit-list__zan'>
                      有用({item.cm_support}) 没用({item.cm_oppose})
                    </div>
                  </div>
                  <div styleName='commit-list__content'>
                    {item.cm_content}
                    {item.cm_sub.length > 0 ? (
                      <ul styleName='commit_sublist' className='mt10'>
                        {item.cm_sub.map(subItem => (
                          <li key={subItem.cm_id}>
                            <div styleName='commit-list__people'>
                              <span styleName='title'>
                                {subItem.at ? (
                                  <span>
                                    <A url={`/people/${subItem.cm_uid}`}>
                                      <Text>{subItem.nickname}</Text>
                                    </A>
                                    回复了
                                    <A url={`/people/${subItem.at.cm_uid}`}>
                                      <Text>{subItem.at.nickname}</Text>
                                    </A>
                                  </span>
                                ) : (
                                  <A url={`/people/${subItem.cm_uid}`}>
                                    <Text>{subItem.nickname}</Text>
                                  </A>
                                )}
                              </span>
                              <span styleName='time'>{subItem.cm_addtime}</span>
                              <div styleName='commit-list__zan'>
                                有用({subItem.cm_support}) 没用({subItem.cm_oppose})
                              </div>
                            </div>
                            <div styleName='commit-list__content'>{subItem.cm_content}</div>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </View>
    )
  }
}

export default Comment
