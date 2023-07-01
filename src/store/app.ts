// Utilities
import { Answer, ByQuestionMapValue } from "@/common/type";
import { getAnswers } from "@/services/answer.service";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import 'moment-timezone';
import moment from 'moment'


export const useAppStore = defineStore("app", () => {

  const loggedInUser = ref(getUser())
  const setUser = (val: any) => {
    loggedInUser.value = val
  };

  const allAnswers = ref<Answer[]>()
  const loading = ref(false)
  const totalAnswers = computed(() => allAnswers.value?.length || 0);
  const totalPoints = ref(0)

  const totalPointArr = reactive([0, 0, 0, 0, 0, 0]);
  const totalAnswerArr = reactive([0, 0, 0, 0, 0, 0]);
  const answersByQuestionMap = reactive<Map<number, { question: number, answers: number[], part: number, avg: string, totalPoint: number, last5Avg: string }>>(new Map())
  const averagePointGroupByDay = ref()

  const byQuestionMap = reactive<Map<number, ByQuestionMapValue>>(new Map())
  const byPartMap = reactive<Map<number, { point: number, count: number, avg: number }>>(new Map())

  const fetchAnswers = async () => {
    try {
      loading.value = true
      const res = await getAnswers(loggedInUser.value.username)
      allAnswers.value = res.data
      if (allAnswers.value?.length) {
        analyzeAnswers()
        analyzeAnswers2()
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false
    }
  }

  const analyzeAnswers2 = () => {
    allAnswers.value?.forEach(answer => {
      const { question, point } = answer;
      if (question <= 0 || question > 120 || (!point && point !== 0)) {
        // ignore invalid answers
        return
      }

      if (byQuestionMap.has(question)) {
        const found = byQuestionMap.get(question);
        found?.answers.push(Number(point))
      } else {
        byQuestionMap.set(question, {
          question: question,
          part: getPart(question),
          answers: [Number(point!)]
        })
      }
    })

    byQuestionMap.forEach((value) => {
      const last3Answers = value.answers.slice(-3);
      value.avg = Number((last3Answers.reduce((prev, cur) => prev + cur, 0) / last3Answers.length).toFixed(1));
    })

    byPartMap.set(1, { point: 0, count: 0, avg: 0 })
    byPartMap.set(2, { point: 0, count: 0, avg: 0 })
    byPartMap.set(3, { point: 0, count: 0, avg: 0 })
    byPartMap.set(4, { point: 0, count: 0, avg: 0 })
    byPartMap.set(5, { point: 0, count: 0, avg: 0 })
    byPartMap.set(6, { point: 0, count: 0, avg: 0 })
    byQuestionMap.forEach(byQuestion => {
      if (byPartMap.has(byQuestion.part)) {
        const byPart = byPartMap.get(byQuestion.part)
        byPart!.count++
        byPart!.point += byQuestion.avg!
        byPart!.avg = Number((byPart!.point / byPart!.count).toFixed(1))
      }
    })


  }

  const analyzeAnswers = () => {
    averagePointGroupByDay.value = {}
    totalPoints.value = 0
    for (let i = 0; i < 6; i++) {
      totalPointArr[i] = 0;
      totalAnswerArr[i] = 0;
    }
    for (let i = 1; i <= 120; i++) {
      answersByQuestionMap.set(i, { question: i, part: 0, avg: '---', answers: [], totalPoint: 0, last5Avg: '' })
    }
    allAnswers.value?.forEach((answer) => {
      if (answer.question >= 91 && answer.question <= 120) {
        answer.part = 5
        totalPointArr[5] += Number(answer.point);
        totalAnswerArr[5]++;
      } else if (answer.question >= 74) {
        answer.part = 4
        totalPointArr[4] += Number(answer.point);
        totalAnswerArr[4]++;
      } else if (answer.question >= 64) {
        answer.part = 3
        totalPointArr[3] += Number(answer.point);
        totalAnswerArr[3]++;
      } else if (answer.question >= 44) {
        answer.part = 2
        totalPointArr[2] += Number(answer.point);
        totalAnswerArr[2]++;
      } else if (answer.question >= 30) {
        answer.part = 1
        totalPointArr[1] += Number(answer.point);
        totalAnswerArr[1]++;
      } else if (answer.question > 1) {
        answer.part = 0
        totalPointArr[0] += Number(answer.point);
        totalAnswerArr[0]++;
      }
      if (answer.question > 0 && answer.question <= 120) {
        const questionObj = answersByQuestionMap.get(Number(answer.question))
        if (questionObj) {
          questionObj.part = answer.part!
          questionObj.answers.push(Number(answer.point))
          questionObj.totalPoint += Number(answer.point)
          questionObj.avg = (questionObj.totalPoint / questionObj.answers.length).toFixed(1)
          const last5Arr = questionObj.answers.slice(-5)
          questionObj.last5Avg = ((last5Arr.reduce((p, c) => p + c, 0)) / last5Arr.length).toFixed(1)
        }
        const timezone = moment.tz.guess()
        const localeDate = moment.tz(answer.createdAt!, timezone).format('DD-MM')
        if (averagePointGroupByDay.value[localeDate]) {
          averagePointGroupByDay.value[localeDate].total += Number(answer.point)
          averagePointGroupByDay.value[localeDate].times++
        } else {
          averagePointGroupByDay.value[localeDate] = {
            total: Number(answer.point),
            times: 1
          }
        }
      }

      totalPoints.value += Number(answer.point);
    });
  }

  return {
    loggedInUser, setUser, fetchAnswers, totalAnswers, totalPoints, loading,
    totalAnswerArr, totalPointArr, answersByQuestionMap, averagePointGroupByDay,
    byQuestionMap, byPartMap
  }
});


function getUser() {
  const savedUserStr = localStorage.getItem("user") || "";
  let savedUser: any = null;
  try {
    savedUser = JSON.parse(savedUserStr);
  } catch (err) {
    savedUser = null;
    console.log(err);

  }
  return savedUser;
}

function getPart(question: number): number {
  if (question >= 91 && question <= 120) {
    return 6;
  } else if (question >= 74) {
    return 5;
  } else if (question >= 64) {
    return 4
  } else if (question >= 44) {
    return 3
  } else if (question >= 30) {
    return 2
  } else if (question > 0) {
    return 1
  }
  throw new Error("Invalid question");
}

