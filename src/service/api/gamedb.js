// import axios from 'axios'
import axios from '@/plugins/ajax'

export default {
  Get_InstanceInfo: (param) => {
    return axios.post('/api/backEnd/Game/Get_InstanceInfo', param)
  }
}
