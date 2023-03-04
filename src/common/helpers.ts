export const generateRandomExam = () => {
  const randomBetween = (start: number, end: number) => {
    return start + Math.floor(Math.random() * (end - start))
  }

  const uniqueObj: any = {}
  const exam: number[] = []
  while (exam.length < 2) {
    const questionNo = randomBetween(1, 29)
    if (!uniqueObj[questionNo]) {
      uniqueObj[questionNo] = true
      exam.push(questionNo)
    }
  }
  while (exam.length < 3) {
    const questionNo = randomBetween(30, 43)
    if (!uniqueObj[questionNo]) {
      uniqueObj[questionNo] = true
      exam.push(questionNo)
    }
  }
  while (exam.length < 5) {
    const questionNo = randomBetween(44, 63)
    if (!uniqueObj[questionNo]) {
      uniqueObj[questionNo] = true
      exam.push(questionNo)
    }
  }
  while (exam.length < 6) {
    const questionNo = randomBetween(64, 73)
    if (!uniqueObj[questionNo]) {
      uniqueObj[questionNo] = true
      exam.push(questionNo)
    }
  }
  while (exam.length < 8) {
    const questionNo = randomBetween(74, 90)
    if (!uniqueObj[questionNo]) {
      uniqueObj[questionNo] = true
      exam.push(questionNo)
    }
  }
  while (exam.length < 10) {
    const questionNo = randomBetween(91, 120)
    if (!uniqueObj[questionNo]) {
      uniqueObj[questionNo] = true
      exam.push(questionNo)
    }
  }

  return exam.sort((a, b) => a - b)
}

export const getAverage = (points: number[]) => {
  return points.length ? (points.reduce((sum, val) => sum + val, 0) / points.length).toFixed(1) : '';
};