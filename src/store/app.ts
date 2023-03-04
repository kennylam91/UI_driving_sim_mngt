// Utilities
import { Answer } from "@/common/type";
import { getAnswers } from "@/services/answer.service";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useAppStore = defineStore("app", () => {

  const loggedInUser = ref(getUser())
  const setUser = (val: any) => { loggedInUser.value = val };

  const allAnswers = ref<Answer[]>()
  const loading = ref(false)
  const totalAnswers = computed(() => allAnswers.value?.length || 0);
  const totalPoints = ref(0)

  const totalPointArr = reactive([0, 0, 0, 0, 0, 0]);
  const totalAnswerArr = reactive([0, 0, 0, 0, 0, 0]);
  const answersByPart = reactive<any>({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] })
  const answersByQuestionMap = reactive<Map<number, { question: number, answers: number[], part: number, avg: string, totalPoint: number }>>(new Map())

  const fetchAnswers = async () => {
    try {
      loading.value = true
      const res = await getAnswers(loggedInUser.value.username)
      allAnswers.value = res.data
      analyzeAnswers()
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false
    }
  }

  const analyzeAnswers = () => {
    for (let i = 0; i < 6; i++) {
      totalPointArr[i] = 0;
      totalAnswerArr[i] = 0;
      answersByPart[i] = []
    }
    for (let i = 1; i <= 120; i++) {
      answersByQuestionMap.set(i, { question: i, part: 0, avg: '---', answers: [], totalPoint: 0 })
    }
    allAnswers.value?.forEach((answer) => {
      if (answer.question >= 91 && answer.question <= 120) {
        answer.part = 5
        totalPointArr[5] += Number(answer.point);
        totalAnswerArr[5]++;
        answersByPart[5].push(answer)
      } else if (answer.question >= 74) {
        answer.part = 4
        totalPointArr[4] += Number(answer.point);
        totalAnswerArr[4]++;
        answersByPart[4].push(answer)
      } else if (answer.question >= 64) {
        answer.part = 3
        totalPointArr[3] += Number(answer.point);
        totalAnswerArr[3]++;
        answersByPart[3].push(answer)
      } else if (answer.question >= 44) {
        answer.part = 2
        totalPointArr[2] += Number(answer.point);
        totalAnswerArr[2]++;
        answersByPart[2].push(answer)
      } else if (answer.question >= 30) {
        answer.part = 1
        totalPointArr[1] += Number(answer.point);
        totalAnswerArr[1]++;
        answersByPart[1].push(answer)
      } else if (answer.question > 1) {
        answer.part = 0
        totalPointArr[0] += Number(answer.point);
        totalAnswerArr[0]++;
        answersByPart[0].push(answer)
      }
      if (answer.question > 0 && answer.question <= 120) {
        const questionObj = answersByQuestionMap.get(Number(answer.question))
        if (questionObj) {
          questionObj.part = answer.part!
          questionObj.answers.push(Number(answer.point))
          questionObj.totalPoint += Number(answer.point)
          questionObj.avg = (questionObj.totalPoint / questionObj.answers.length).toFixed(1)
        }
      }

      totalPoints.value += Number(answer.point);
    });
  }

  return {
    loggedInUser, setUser, fetchAnswers, totalAnswers, totalPoints, loading,
    totalAnswerArr, totalPointArr, answersByPart, answersByQuestionMap
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

