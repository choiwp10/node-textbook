setInterval(() => {
  console.log('시작');
  try {
    throw new Error('서버를 고장내주마');
  } catch (error) {
    console.error(error);
  }
}, 1000);