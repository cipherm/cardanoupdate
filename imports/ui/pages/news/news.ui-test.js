const assert = require('assert')
const baseUrl = 'http://localhost:3000'

describe('News page', function () {
    before(() => {
        browser.url(`${baseUrl}/`)
        browser.pause(5000)

        browser.execute(() => {
            Meteor.call('generateTestUser', (err, data) => {})

            return 'ok'
        })

        browser.pause(5000)

        browser.execute(() => Meteor.loginWithPassword('testing', 'testing'))

        browser.pause(10000)
    })

    it('user can add new news', function () {
        browser.click('#js-new')

        browser.pause(3000)

        browser.setValue('#headline', 'Headline test')
        browser.pause(1000)
        browser.setValue('#summary', 'Summary test')
        browser.pause(1000)

        browser.click('.add-news')
        browser.pause(2000)

        assert(browser.execute(() => $('#bodyError').text().trim() === 'Body is required').value, true)

        browser.execute(() => { MDEdit.body.value('Body test') })
        browser.pause(1000)

        browser.click('.add-news')
        browser.pause(3000)

        assert(browser.execute(() => FlowRouter.current().route.name === 'home').value, true)
    })

    it('user can edit news he/she created', () => {
        browser.click('#js-edit')
        browser.pause(3000)

        browser.setValue('#headline', 'Headline test 2')
        browser.pause(1000)

        browser.click('.add-news')
        browser.pause(3000)

        assert(browser.execute(() => FlowRouter.current().route.name === 'home').value, true)

        assert(browser.execute(() => Array.from($('.news-item').find('.card-title a')).some(i => $(i).text().trim() === 'Headline test 2')).value, true)
    })

    it('user can vote on news', () => {
        let count = browser.execute(() => $('.vote-news').length).value

        browser.click('.vote-news')
        browser.pause(3000)

        let countN = browser.execute(() => $('.vote-news').length).value

        assert(count === countN + 2, true)
    })

    it('user can read the news', () => {
        browser.execute(() => FlowRouter.go('/news/headline-test-1'))
        browser.pause(3000)

        assert(browser.execute(() => $('h3').text() === 'Headline test 2').value, true)
        assert(browser.execute(() => $('.summary').text().trim() === 'Summary test').value, true)
        assert(browser.execute(() => $('.content').text().trim() === 'Body test').value, true)
    })

    it('user can flag a news item', () => {
        browser.click('.flag-news')
        browser.pause(2000)

        browser.setValue('.swal2-input', 'Test flag news')
        browser.pause(1000)

        browser.click('.swal2-confirm')
        browser.pause(3000)
    })

    it('user can comment', () => {
        browser.setValue('#comments', 'Test comment')
        browser.pause(1000)

        browser.click('.new-comment')
        browser.pause(3000)

        assert(browser.execute(() => $($('.news-comments').find('.card-body span').get(0)).text().trim() === 'Test comment').value, true)
    })

    it('user can edit a comment', () => {
        browser.click('.edit-mode')
        browser.pause(2000)

        browser.setValue('#js-comment', 'Test comment 2')
        browser.pause(1000)

        browser.click('.edit-comment')
        browser.pause(3000)

        assert(browser.execute(() => $($('.news-comments').find('.card-body span').get(0)).text().trim() === 'Test comment 2').value, true)
    })

    it('user can flag a comment', () => {
        browser.click('.flag-comment')
        browser.pause(2000)

        browser.setValue('.swal2-input', 'Test flag')
        browser.pause(1000)

        browser.click('.swal2-confirm')
        browser.pause(3000)
    })

    it('user can remove a comment', () => {
        browser.click('.delete-comment')
        browser.pause(2000)

        browser.click('.swal2-confirm')
        browser.pause(2000)

        assert(browser.execute(() => $('.news-comments').find('.card').length === 1).value, true)
    })

    it('user can remove news he/she created', () => {
        browser.url(`${baseUrl}/`)
        browser.pause(5000)

        let count = browser.execute(() => $('.news-item').length).value

        browser.click('#js-remove')
        browser.pause(2000)

        browser.click('.swal2-confirm')
        browser.pause(3000)

        let countN = browser.execute(() => $('.news-item').length).value

        assert(count === countN + 1, true)
    })

    it('user can be suspended', () => {
        browser.execute(() => Meteor.call('toggleSuspended', (err, data) => {}))
        browser.pause(3000)

        assert(browser.execute(() => FlowRouter.current().route.name === 'suspended').value, true)

        browser.execute(() => Meteor.call('toggleSuspended', (err, data) => {}))
        browser.pause(3000)
        browser.execute(() => FlowRouter.go('/'))
        browser.pause(5000)

        assert(browser.execute(() => FlowRouter.current().route.name === 'home').value, true)
    })
})