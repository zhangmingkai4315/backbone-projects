// global.app = app || {}
var LibraryView = require('./views/LibraryView');

var books = [{
        title: 'Javascript Program',
        author: 'Douglas',
        keywords: 'javascript'
    },
    {
        title: 'Go Program',
        author: 'Alice',
        keywords: 'go'
    },
    {
        title: 'Java Program',
        author: 'Mike',
        keywords: 'java'
    },
    {
        title: 'Python Program',
        author: 'Jone',
        keywords: 'python'
    },
    {
        title: 'c++ Program',
        author: 'Cello',
        keywords: 'c++'
    },
        {
        title: 'Python Program2',
        author: 'Jone2',
        keywords: 'python'
    },
    {
        title: 'c++ Program2',
        author: 'Cello2',
        keywords: 'c++'
    },
]

new LibraryView(books);