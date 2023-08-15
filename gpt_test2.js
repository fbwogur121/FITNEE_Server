const {Configuration, OpenAIApi} = require('openai');
const secret = require("./config/secret");

const configuration = new Configuration({
    organization: secret.openaiOrganization,
    apiKey: secret.openaiSecret,
});
const openai = new OpenAIApi(configuration);

const temp = async function() {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "You're a fitness trainer who recommends exercise routines."},
            {role: "system", content: `
            exerciseId-exerciseName-note(rep of unit),
            1-Bench Press,
            2-Incline Dumbbell Press,
            3-Chest Press Machine,
            4-Leg Extension,
            5-Lat Pull down,
            6-Barbell Row,
            7-Deadlift,
            8-Dumbbell Row,
            9-Shoulder Press,
            10-Side Lateral Raise,
            11-Front Dumbbell Raise,
            12-Bent Over Lateral Raise,
            13-Seated Row,
            14-Leg Curl,
            15-Leg Press,
            16-Bench Fly,
            17-Hip Thrust,
            18-Hip Raise,
            19-Chest Dips,
            20-Pull Up,
            21-Push Up,
            22-Front Plank-(1sec),
            23-Side Plank-(1sec),
            24-Running-(100m),
            25-Cycling-(100m)
            Create a routine with these exercises
            `
            },
            {role: "user", content: `
            I am a male born in 2001, I am 174cm tall and weigh 62kg.
            I think I can lift up to 60kg when I do bench press to the maximum.
            I will do chest exercises.
            I did the following routine for my last chest workout and this one.
            
            {
                "Last Chest exercise": {
                    "target": "Chest",
                    "content": [
                        {
                            "exerciseId": 1,
                            "exerciseName": "Bench Press",
                            "sets": 3,
                            "reps": 10,
                            "weights": [50, 55, 60]
                        },
                        {
                            "exerciseId": 2,
                            "exerciseName": "Incline Dumbbell Press",
                            "sets": 3,
                            "reps": 12,
                            "weights": [15, 20, 25]
                        },
                        {
                            "exerciseId": 3,
                            "exerciseName": "Chest Press Machine",
                            "sets": 3,
                            "reps": 12,
                            "weights": [30, 35, 40]
                        },
                        {
                            "exerciseId": 19,
                            "exerciseName": "Chest Dips",
                            "sets": 3,
                            "reps": 10
                        }
                    ]
                },
                "Today Chest exercise": {
                    "target": "Chest",
                    "content": [
                        {
                            "exerciseId": 1,
                            "exerciseName": "Bench Press",
                            "sets": 4,
                            "reps": 8,
                            "weights": [50, 55, 60, 55]
                        },
                        {
                            "exerciseId": 2,
                            "exerciseName": "Incline Dumbbell Press",
                            "sets": 3,
                            "reps": 12,
                            "weights": [20, 20, 25]
                        },
                        {
                            "exerciseId": 3,
                            "exerciseName": "Chest Press Machine",
                            "sets": 3,
                            "reps": 12,
                            "weights": [35, 40, 45]
                        },
                        {
                            "exerciseId": 19,
                            "exerciseName": "Chest Dips",
                            "sets": 3,
                            "reps": 12
                        }
                    ]
                }
            }
            please recommend Considering the increase or decrease in sets, reps, and weight for each exercise in the previous workout and today's workout, recommend changes to the sets, reps, and weight I should perform in the following back workouts.
            
            Say only JSON Object format like
            [
                {
                    "Next time Chest exercise": {
                        'target': targetArea,
                        'content': [
                            {
                                'exerciseId': exerciseId,
                                'exerciseName': exerciseName,
                                'sets': numsOfSet(Only Int),
                                'reps': numsOfRep(Only Int),
                                'weights'(If exerciseId is between 19 and 25, that is, bare body exercise, get rid of this.): numsOfWeight(Only List(Integer as many as numsOfSet))
                            }
                        ]
                    }
                }
            ](This array must have three elements that are the number of branches of the routine example.)
            In the case of planks, if 1 rep performs 1 second, that is, 10 seconds, using note(rep of unit), rep should be 10.
            In the case of Running and Cycling, if 1 rep performs 100m, that is, 500m, using note(rep of unit), rep should be 5.

            example
            {
                "Next time Chest exercise": {
                    "target": "Chest",
                    "content": [
                        {
                            "exerciseId": 1,
                            "exerciseName": "Bench Press",
                            "sets": 4,
                            "reps": 8,
                            "weights": [50, 55, 60, 55]
                        },
                        {
                            "exerciseId": 2,
                            "exerciseName": "Incline Dumbbell Press",
                            "sets": 3,
                            "reps": 12,
                            "weights": [20, 20, 25]
                        },
                        {
                            "exerciseId": 3,
                            "exerciseName": "Chest Press Machine",
                            "sets": 3,
                            "reps": 12,
                            "weights": [35, 40, 45]
                        },
                        {
                            "exerciseId": 19,
                            "exerciseName": "Chest Dips",
                            "sets": 3,
                            "reps": 12
                        }
                    ]
                }
            }
            Never Explain.
            `}
        ],
    });
    console.log(completion.data.choices[0].message.content);
};

temp();