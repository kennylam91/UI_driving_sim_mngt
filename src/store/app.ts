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

  const totalAnswerArr = reactive([0, 0, 0, 0, 0, 0]);
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
    for (let i = 0; i < 6; i++) {
      totalAnswerArr[i] = 0;
    }
    allAnswers.value?.forEach((answer) => {
      try {
        const part = getPart(answer.question)
        answer.part = part
        totalAnswerArr[part - 1]++
      } catch (error) {
        console.log(error);
      }

      if (answer.question > 0 && answer.question <= 120) {
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

    });
  }

  return {
    loggedInUser, setUser, fetchAnswers, totalAnswers, loading,
    totalAnswerArr, averagePointGroupByDay,
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

