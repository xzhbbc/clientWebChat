import axios from 'axios'

//获取客服
export const getClient = async function (bol) {
  const getData = await axios.get('/getClient?admin=' + bol).data
  return {
    data: getData
  }
}
