import { test } from '@playwright/test'

import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './utils/helpers/helpers'
import { TasksPage } from './utils/pages/tasks/'

import data from './fixtures/tasks.json'

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
})

test.describe('Cadastro', () => {
    test('You must register a new task', async ({ request }) => {
        //Externalizando a massa de dados
        const task = data.success as TaskModel
        await deleteTaskByHelper(request, task.name)
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('You should not register duplicate tasks', async ({ request }) => {
        const task = data.duplicate as TaskModel
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')

    })

    test('Required field', async () => {
        const task = data.required as TaskModel
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.validateFieldRequired('This is a required field')
    })
})

test.describe('Atualização', () => {
    test('Must complete a task', async ({ request }) => {
        const task = data.update as TaskModel
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('Exclusão', () => {
    test('Must delete a task', async ({ request }) => {
        const task = data.delete as TaskModel
        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)
        await tasksPage.go()
        await tasksPage.remove(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})