export default [
  {
    label: '默认',
    name: 'default',
    theme: {
      // 默认，dark, info, primary, danger, success, warming
      headerTheme: 'info',
      headerColor:'white',
    }
  },
  {
    label: '黑色',
    name: 'dark',
    theme: {
      backgroundColor: '#333940',
      textColor: '#E0E0E0',
      activeTextColor: '#fff',
      headerTheme: 'dark',
      headerColor:'white',
    }
  },
  {
    label: '科技',
    name: 'keji',
    theme: {
      // backgroundColor: '#222D32',    //有人喜欢界面难看 拦都拦不住
      backgroundColor: '#12AFE3',
      // textColor: '#b8c7ce',
      // activeTextColor: '#fff',
      textColor: '#fff',
      activeTextColor: '#b8c7ce',
      headerTheme: 'info',
      headerColor:'white',
    }
  },
  {
    label: '红艳',
    name: 'hongyan',
    theme: {
      // backgroundColor: '#282C34',
      backgroundColor: '#F56C6C',
      // textColor: '#F0F0F5',
      // activeTextColor: '#fff',
      textColor: '#fff',
      activeTextColor: '#F0F0F5',
      headerTheme: 'danger',
      headerColor:'white',
    }
  },
  {
    label: '白色',
    name: 'white',
    theme: {
      backgroundColor: '#FFFFFF',
      textColor: '#303133',
      activeTextColor: '#282C34',
      headerTheme: '',
      headerColor:'dark',
    }
  }
]
