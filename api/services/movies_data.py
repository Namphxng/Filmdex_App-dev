"""Mock movie/series catalog — no TMDB API key required.

Ported from backend/services/tmdbService.js. Image URLs use the public TMDB CDN
(no auth needed for /t/p/ images, only for the JSON API).
"""

from helpers import paginate

MOVIES = [
    # ─── MOVIES ───────────────────────────────────────────────────────────
    {
        'tmdbId': 27205, 'title': 'Inception', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [878, 28, 12], 'genreNames': ['Science Fiction', 'Action', 'Adventure'],
        'releaseYear': 2010, 'rating': 8.4, 'popularity': 98,
        'poster': 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        'overview': 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        'runtime': 148,
        'cast': [
            {'name': 'Leonardo DiCaprio', 'character': 'Cobb', 'photo': None},
            {'name': 'Joseph Gordon-Levitt', 'character': 'Arthur', 'photo': None},
            {'name': 'Elliot Page', 'character': 'Ariadne', 'photo': None},
            {'name': 'Tom Hardy', 'character': 'Eames', 'photo': None},
        ],
    },
    {
        'tmdbId': 155, 'title': 'The Dark Knight', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [28, 80, 18], 'genreNames': ['Action', 'Crime', 'Drama'],
        'releaseYear': 2008, 'rating': 9.0, 'popularity': 99,
        'poster': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/hkBaDkMWbLaf8B1lsWsqX7An9Ld.jpg',
        'overview': 'Batman raises the stakes in his war on crime. With the help of Lieutenant Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague Gotham City.',
        'runtime': 152,
        'cast': [
            {'name': 'Christian Bale', 'character': 'Bruce Wayne', 'photo': None},
            {'name': 'Heath Ledger', 'character': 'Joker', 'photo': None},
            {'name': 'Aaron Eckhart', 'character': 'Harvey Dent', 'photo': None},
        ],
    },
    {
        'tmdbId': 157336, 'title': 'Interstellar', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [878, 18, 12], 'genreNames': ['Science Fiction', 'Drama', 'Adventure'],
        'releaseYear': 2014, 'rating': 8.6, 'popularity': 96,
        'poster': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
        'overview': "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        'runtime': 169,
        'cast': [
            {'name': 'Matthew McConaughey', 'character': 'Cooper', 'photo': None},
            {'name': 'Anne Hathaway', 'character': 'Brand', 'photo': None},
            {'name': 'Jessica Chastain', 'character': 'Murph', 'photo': None},
        ],
    },
    {
        'tmdbId': 278, 'title': 'The Shawshank Redemption', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [18, 80], 'genreNames': ['Drama', 'Crime'],
        'releaseYear': 1994, 'rating': 8.7, 'popularity': 92,
        'poster': 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/avedvodAZUcwqevBfm8p4G2NziQ.jpg',
        'overview': 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        'runtime': 142,
        'cast': [
            {'name': 'Tim Robbins', 'character': 'Andy Dufresne', 'photo': None},
            {'name': 'Morgan Freeman', 'character': 'Ellis Boyd "Red" Redding', 'photo': None},
        ],
    },
    {
        'tmdbId': 496243, 'title': 'Parasite', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [35, 18, 53], 'genreNames': ['Comedy', 'Drama', 'Thriller'],
        'releaseYear': 2019, 'rating': 8.5, 'popularity': 93,
        'poster': 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
        'overview': 'All unemployed, Ki-taek and his family take peculiar interest in the wealthy Park family, as they begin to infiltrate their household one by one.',
        'runtime': 132,
        'cast': [
            {'name': 'Song Kang-ho', 'character': 'Ki-taek', 'photo': None},
            {'name': 'Lee Sun-kyun', 'character': 'Park Dong-ik', 'photo': None},
        ],
    },
    {
        'tmdbId': 238, 'title': 'The Godfather', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [18, 80], 'genreNames': ['Drama', 'Crime'],
        'releaseYear': 1972, 'rating': 8.7, 'popularity': 90,
        'poster': 'https://image.tmdb.org/t/p/w500/uisRetm8GRvEq7LiiIvOaQMIOoY.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
        'overview': 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.',
        'runtime': 175,
        'cast': [
            {'name': 'Marlon Brando', 'character': 'Don Vito Corleone', 'photo': None},
            {'name': 'Al Pacino', 'character': 'Michael Corleone', 'photo': None},
        ],
    },
    {
        'tmdbId': 680, 'title': 'Pulp Fiction', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [53, 80], 'genreNames': ['Thriller', 'Crime'],
        'releaseYear': 1994, 'rating': 8.5, 'popularity': 89,
        'poster': 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
        'overview': 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits interweave in four tales of violence and redemption.',
        'runtime': 154,
        'cast': [
            {'name': 'John Travolta', 'character': 'Vincent Vega', 'photo': None},
            {'name': 'Samuel L. Jackson', 'character': 'Jules Winnfield', 'photo': None},
            {'name': 'Uma Thurman', 'character': 'Mia Wallace', 'photo': None},
        ],
    },
    {
        'tmdbId': 603, 'title': 'The Matrix', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [28, 878], 'genreNames': ['Action', 'Science Fiction'],
        'releaseYear': 1999, 'rating': 8.2, 'popularity': 91,
        'poster': 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
        'overview': 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        'runtime': 136,
        'cast': [
            {'name': 'Keanu Reeves', 'character': 'Neo', 'photo': None},
            {'name': 'Laurence Fishburne', 'character': 'Morpheus', 'photo': None},
            {'name': 'Carrie-Anne Moss', 'character': 'Trinity', 'photo': None},
        ],
    },
    {
        'tmdbId': 475557, 'title': 'Joker', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [80, 18, 53], 'genreNames': ['Crime', 'Drama', 'Thriller'],
        'releaseYear': 2019, 'rating': 8.2, 'popularity': 94,
        'poster': 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
        'overview': 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.',
        'runtime': 122,
        'cast': [
            {'name': 'Joaquin Phoenix', 'character': 'Arthur Fleck / Joker', 'photo': None},
            {'name': 'Robert De Niro', 'character': 'Murray Franklin', 'photo': None},
        ],
    },
    {
        'tmdbId': 438631, 'title': 'Dune', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [878, 12], 'genreNames': ['Science Fiction', 'Adventure'],
        'releaseYear': 2021, 'rating': 7.9, 'popularity': 88,
        'poster': 'https://image.tmdb.org/t/p/w500/hMvjIYZ9JR8DI1wogSGZkZjrRsS.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/iopYFB1b6Bh7FWZh3onQhph1CZf.jpg',
        'overview': 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.',
        'runtime': 155,
        'cast': [
            {'name': 'Timothée Chalamet', 'character': 'Paul Atreides', 'photo': None},
            {'name': 'Zendaya', 'character': 'Chani', 'photo': None},
            {'name': 'Oscar Isaac', 'character': 'Duke Leto Atreides', 'photo': None},
        ],
    },
    {
        'tmdbId': 872585, 'title': 'Oppenheimer', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [18, 36, 53], 'genreNames': ['Drama', 'History', 'Thriller'],
        'releaseYear': 2023, 'rating': 8.2, 'popularity': 97,
        'poster': 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
        'overview': "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
        'runtime': 181,
        'cast': [
            {'name': 'Cillian Murphy', 'character': 'J. Robert Oppenheimer', 'photo': None},
            {'name': 'Emily Blunt', 'character': 'Katherine "Kitty" Oppenheimer', 'photo': None},
            {'name': 'Matt Damon', 'character': 'General Leslie Groves Jr.', 'photo': None},
        ],
    },
    {
        'tmdbId': 545611, 'title': 'Everything Everywhere All at Once', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [878, 12, 35], 'genreNames': ['Science Fiction', 'Adventure', 'Comedy'],
        'releaseYear': 2022, 'rating': 7.9, 'popularity': 86,
        'poster': 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/feSiISwgEpVzR1v3zv2n2LsbthE.jpg',
        'overview': 'An aging Chinese immigrant is swept up in an insane adventure, in which she alone can save the world by exploring other universes connecting with the lives she could have led.',
        'runtime': 139,
        'cast': [
            {'name': 'Michelle Yeoh', 'character': 'Evelyn Wang', 'photo': None},
            {'name': 'Ke Huy Quan', 'character': 'Waymond Wang', 'photo': None},
        ],
    },
    {
        'tmdbId': 76341, 'title': 'Mad Max: Fury Road', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [28, 12, 878], 'genreNames': ['Action', 'Adventure', 'Science Fiction'],
        'releaseYear': 2015, 'rating': 7.9, 'popularity': 84,
        'poster': 'https://image.tmdb.org/t/p/w500/gioi31RDMpSMwlDmnx6MTaggsPt.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/phszHPFMfHRBm8Vfp4A2zMIFBLl.jpg',
        'overview': 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.',
        'runtime': 120,
        'cast': [
            {'name': 'Tom Hardy', 'character': 'Max Rockatansky', 'photo': None},
            {'name': 'Charlize Theron', 'character': 'Imperator Furiosa', 'photo': None},
        ],
    },
    {
        'tmdbId': 244786, 'title': 'Whiplash', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [18, 10402], 'genreNames': ['Drama', 'Music'],
        'releaseYear': 2014, 'rating': 8.4, 'popularity': 87,
        'poster': 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/fRGxZuo7jJUWQsVg9PREb98Aclp.jpg',
        'overview': 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an abusive instructor.',
        'runtime': 107,
        'cast': [
            {'name': 'Miles Teller', 'character': 'Andrew Neiman', 'photo': None},
            {'name': 'J.K. Simmons', 'character': 'Terence Fletcher', 'photo': None},
        ],
    },
    {
        'tmdbId': 313369, 'title': 'La La Land', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [18, 10749, 10402], 'genreNames': ['Drama', 'Romance', 'Music'],
        'releaseYear': 2016, 'rating': 8.0, 'popularity': 83,
        'poster': 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/nadTlnTE6DdgmFxDPCx6gGLtABT.jpg',
        'overview': 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
        'runtime': 128,
        'cast': [
            {'name': 'Ryan Gosling', 'character': 'Sebastian Wilder', 'photo': None},
            {'name': 'Emma Stone', 'character': 'Mia Dolan', 'photo': None},
        ],
    },
    {
        'tmdbId': 245891, 'title': 'John Wick', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [28, 53], 'genreNames': ['Action', 'Thriller'],
        'releaseYear': 2014, 'rating': 7.4, 'popularity': 85,
        'poster': 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/umC04Cozevu8nn3JTDJ1pc7PVTn.jpg',
        'overview': 'An ex-hitman comes out of retirement to track down the gangsters that killed his dog and took everything from him.',
        'runtime': 101,
        'cast': [
            {'name': 'Keanu Reeves', 'character': 'John Wick', 'photo': None},
            {'name': 'Michael Nyqvist', 'character': 'Viggo Tarasov', 'photo': None},
        ],
    },
    {
        'tmdbId': 414906, 'title': 'The Batman', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [80, 9648, 28], 'genreNames': ['Crime', 'Mystery', 'Action'],
        'releaseYear': 2022, 'rating': 7.8, 'popularity': 90,
        'poster': 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/5P8SmMzSNYikXpxil6BYzJ16611.jpg',
        'overview': "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
        'runtime': 176,
        'cast': [
            {'name': 'Robert Pattinson', 'character': 'Bruce Wayne / Batman', 'photo': None},
            {'name': 'Zoë Kravitz', 'character': 'Selina Kyle / Catwoman', 'photo': None},
            {'name': 'Paul Dano', 'character': 'Edward Nashton / The Riddler', 'photo': None},
        ],
    },
    {
        'tmdbId': 346698, 'title': 'Barbie', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [35, 12], 'genreNames': ['Comedy', 'Adventure'],
        'releaseYear': 2023, 'rating': 7.0, 'popularity': 95,
        'poster': 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/nHf61UzkfFno5X1ofIhugCPus2R.jpg',
        'overview': 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.',
        'runtime': 114,
        'cast': [
            {'name': 'Margot Robbie', 'character': 'Barbie', 'photo': None},
            {'name': 'Ryan Gosling', 'character': 'Ken', 'photo': None},
        ],
    },
    {
        'tmdbId': 19995, 'title': 'Avatar', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [28, 12, 14, 878], 'genreNames': ['Action', 'Adventure', 'Fantasy', 'Science Fiction'],
        'releaseYear': 2009, 'rating': 7.6, 'popularity': 89,
        'poster': 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg',
        'overview': 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.',
        'runtime': 162,
        'cast': [
            {'name': 'Sam Worthington', 'character': 'Jake Sully', 'photo': None},
            {'name': 'Zoe Saldana', 'character': 'Neytiri', 'photo': None},
        ],
    },
    {
        'tmdbId': 419430, 'title': 'Get Out', 'type': 'movie', 'tmdbType': 'movie',
        'genreIds': [27, 9648, 53], 'genreNames': ['Horror', 'Mystery', 'Thriller'],
        'releaseYear': 2017, 'rating': 7.7, 'popularity': 80,
        'poster': 'https://image.tmdb.org/t/p/w500/6MGKjX3KlpSqwCV0Ezxrh95KNGU.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/v4oB09LxGgNCP10p4pPuwYFfwCA.jpg',
        'overview': "A young African-American visits his white girlfriend's parents for the weekend, where his unsettling discoveries lead to a truth he never could have imagined.",
        'runtime': 104,
        'cast': [
            {'name': 'Daniel Kaluuya', 'character': 'Chris Washington', 'photo': None},
            {'name': 'Allison Williams', 'character': 'Rose Armitage', 'photo': None},
        ],
    },

    # ─── TV SERIES ────────────────────────────────────────────────────────
    {
        'tmdbId': 1396, 'title': 'Breaking Bad', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 80], 'genreNames': ['Drama', 'Crime'],
        'releaseYear': 2008, 'rating': 9.5, 'popularity': 99,
        'poster': 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
        'overview': 'When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live, he becomes filled with a sense of fearlessness.',
        'runtime': 47,
        'cast': [
            {'name': 'Bryan Cranston', 'character': 'Walter White', 'photo': None},
            {'name': 'Aaron Paul', 'character': 'Jesse Pinkman', 'photo': None},
            {'name': 'Anna Gunn', 'character': 'Skyler White', 'photo': None},
        ],
    },
    {
        'tmdbId': 1399, 'title': 'Game of Thrones', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [10765, 18, 28], 'genreNames': ['Sci-Fi & Fantasy', 'Drama', 'Action & Adventure'],
        'releaseYear': 2011, 'rating': 8.4, 'popularity': 97,
        'poster': 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
        'overview': 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.',
        'runtime': 57,
        'cast': [
            {'name': 'Peter Dinklage', 'character': 'Tyrion Lannister', 'photo': None},
            {'name': 'Emilia Clarke', 'character': 'Daenerys Targaryen', 'photo': None},
            {'name': 'Kit Harington', 'character': 'Jon Snow', 'photo': None},
        ],
    },
    {
        'tmdbId': 66732, 'title': 'Stranger Things', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 9648, 878], 'genreNames': ['Drama', 'Mystery', 'Science Fiction'],
        'releaseYear': 2016, 'rating': 8.7, 'popularity': 96,
        'poster': 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
        'overview': 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
        'runtime': 51,
        'cast': [
            {'name': 'Millie Bobby Brown', 'character': 'Eleven', 'photo': None},
            {'name': 'Finn Wolfhard', 'character': 'Mike Wheeler', 'photo': None},
            {'name': 'Winona Ryder', 'character': 'Joyce Byers', 'photo': None},
        ],
    },
    {
        'tmdbId': 93405, 'title': 'Squid Game', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 28, 53], 'genreNames': ['Drama', 'Action & Adventure', 'Mystery'],
        'releaseYear': 2021, 'rating': 7.9, 'popularity': 98,
        'poster': 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/qw3J9cNeLioOLoR68WX7z79aCdK.jpg',
        'overview': "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
        'runtime': 54,
        'cast': [
            {'name': 'Lee Jung-jae', 'character': 'Gi-hun', 'photo': None},
            {'name': 'Park Hae-soo', 'character': 'Sang-woo', 'photo': None},
        ],
    },
    {
        'tmdbId': 100088, 'title': 'The Last of Us', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 28, 10765], 'genreNames': ['Drama', 'Action & Adventure', 'Sci-Fi & Fantasy'],
        'releaseYear': 2023, 'rating': 8.6, 'popularity': 95,
        'poster': 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/9PqD3wSIjntyJDBzMNuxuKHcMbB.jpg',
        'overview': 'Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of a quarantine zone. What starts as a small job soon becomes a brutal and heartbreaking journey.',
        'runtime': 55,
        'cast': [
            {'name': 'Pedro Pascal', 'character': 'Joel Miller', 'photo': None},
            {'name': 'Bella Ramsey', 'character': 'Ellie Williams', 'photo': None},
        ],
    },
    {
        'tmdbId': 71446, 'title': 'Money Heist', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [80, 18, 28], 'genreNames': ['Crime', 'Drama', 'Action & Adventure'],
        'releaseYear': 2017, 'rating': 8.2, 'popularity': 91,
        'poster': 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/xGexTKCJDkl61wTgCEm3r7SBhxO.jpg',
        'overview': 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history — stealing 2.4 billion euros from the Royal Mint of Spain.',
        'runtime': 45,
        'cast': [
            {'name': 'Álvaro Morte', 'character': 'The Professor', 'photo': None},
            {'name': 'Úrsula Corberó', 'character': 'Tokyo', 'photo': None},
        ],
    },
    {
        'tmdbId': 87108, 'title': 'Chernobyl', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 36], 'genreNames': ['Drama', 'History'],
        'releaseYear': 2019, 'rating': 9.4, 'popularity': 88,
        'poster': 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/cMBSIBFByFuf0XXmxBuLHN1qTZA.jpg',
        'overview': "In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the world's worst nuclear disasters.",
        'runtime': 65,
        'cast': [
            {'name': 'Jared Harris', 'character': 'Valery Legasov', 'photo': None},
            {'name': 'Stellan Skarsgård', 'character': 'Boris Shcherbina', 'photo': None},
        ],
    },
    {
        'tmdbId': 42009, 'title': 'Black Mirror', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 878, 53], 'genreNames': ['Drama', 'Science Fiction', 'Mystery'],
        'releaseYear': 2011, 'rating': 8.3, 'popularity': 86,
        'poster': 'https://image.tmdb.org/t/p/w500/7PRddO7z7mcPi21nZTCMGShAyy1.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/mS0BKgNkAEViPDSRKb3OPe0aUeN.jpg',
        'overview': "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
        'runtime': 60,
        'cast': [
            {'name': 'Various', 'character': 'Anthology Cast', 'photo': None},
        ],
    },
    {
        'tmdbId': 60574, 'title': 'Peaky Blinders', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 80, 36], 'genreNames': ['Drama', 'Crime', 'History'],
        'releaseYear': 2013, 'rating': 8.8, 'popularity': 90,
        'poster': 'https://image.tmdb.org/t/p/w500/o3SXacFtqjkvNCB1P5RQzoQqcnc.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/wiE9doxiLwq3WCGamDIOb2PqBqc.jpg',
        'overview': 'A gangster family epic set in 1919 Birmingham, England and centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.',
        'runtime': 55,
        'cast': [
            {'name': 'Cillian Murphy', 'character': 'Tommy Shelby', 'photo': None},
            {'name': 'Paul Anderson', 'character': 'Arthur Shelby', 'photo': None},
        ],
    },
    {
        'tmdbId': 76331, 'title': 'Succession', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 80], 'genreNames': ['Drama', 'Crime'],
        'releaseYear': 2018, 'rating': 8.8, 'popularity': 89,
        'poster': 'https://image.tmdb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/6nE3UolkE9cCaGFcFjAGKgR3p8B.jpg',
        'overview': 'The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps back from the company.',
        'runtime': 60,
        'cast': [
            {'name': 'Brian Cox', 'character': 'Logan Roy', 'photo': None},
            {'name': 'Jeremy Strong', 'character': 'Kendall Roy', 'photo': None},
        ],
    },
    {
        'tmdbId': 76479, 'title': 'The Boys', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [28, 878, 80], 'genreNames': ['Action & Adventure', 'Science Fiction', 'Crime'],
        'releaseYear': 2019, 'rating': 8.7, 'popularity': 94,
        'poster': 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/mGVrXeIjyecj6TKmwPVpHlscEmw.jpg',
        'overview': 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers. Based on the comic book series of the same name.',
        'runtime': 60,
        'cast': [
            {'name': 'Karl Urban', 'character': 'Billy Butcher', 'photo': None},
            {'name': 'Jack Quaid', 'character': 'Hughie Campbell', 'photo': None},
            {'name': 'Antony Starr', 'character': 'Homelander', 'photo': None},
        ],
    },
    {
        'tmdbId': 94605, 'title': 'Arcane', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [16, 28, 878], 'genreNames': ['Animation', 'Action & Adventure', 'Science Fiction'],
        'releaseYear': 2021, 'rating': 9.0, 'popularity': 92,
        'poster': 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/rkB4LyZHo1NiXfoZ71Iu1LAvwvN.jpg',
        'overview': 'Set in utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League of Legends champions and the power that will tear them apart.',
        'runtime': 41,
        'cast': [
            {'name': 'Hailee Steinfeld', 'character': 'Vi (voice)', 'photo': None},
            {'name': 'Ella Purnell', 'character': 'Jinx (voice)', 'photo': None},
        ],
    },
    {
        'tmdbId': 94997, 'title': 'House of the Dragon', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [10765, 18, 28], 'genreNames': ['Sci-Fi & Fantasy', 'Drama', 'Action & Adventure'],
        'releaseYear': 2022, 'rating': 8.4, 'popularity': 93,
        'poster': 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg',
        'overview': 'The story of House Targaryen set 200 years before the events of Game of Thrones, beginning with King Viserys I.',
        'runtime': 60,
        'cast': [
            {'name': 'Matt Smith', 'character': 'Prince Daemon Targaryen', 'photo': None},
            {'name': 'Paddy Considine', 'character': 'King Viserys I Targaryen', 'photo': None},
        ],
    },
    {
        'tmdbId': 119051, 'title': 'Wednesday', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [35, 9648, 27], 'genreNames': ['Comedy', 'Mystery', 'Horror'],
        'releaseYear': 2022, 'rating': 8.1, 'popularity': 90,
        'poster': 'https://image.tmdb.org/t/p/w500/cbosZ3ceQ2PRNA7853N8hZ38nn5.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/9PqD3wSIjntyJDBzMNuxuKHcMbB.jpg',
        'overview': "Follows Wednesday Addams' years as a student at Nevermore Academy, where she attempts to master her emerging psychic ability, thwart a monstrous killing spree that has terrorized the local town.",
        'runtime': 50,
        'cast': [
            {'name': 'Jenna Ortega', 'character': 'Wednesday Addams', 'photo': None},
            {'name': 'Gwendoline Christie', 'character': 'Principal Larissa Weems', 'photo': None},
        ],
    },
    {
        'tmdbId': 136315, 'title': 'The Bear', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 35], 'genreNames': ['Drama', 'Comedy'],
        'releaseYear': 2022, 'rating': 8.6, 'popularity': 85,
        'poster': 'https://image.tmdb.org/t/p/w500/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/7SFzFkEbkMfhEzXV7AcRXc1vnJG.jpg',
        'overview': "A young chef from the fine dining world comes to Chicago to run his family's sandwich shop after a tragedy.",
        'runtime': 31,
        'cast': [
            {'name': 'Jeremy Allen White', 'character': 'Carmen "Carmy" Berzatto', 'photo': None},
            {'name': 'Ebon Moss-Bachrach', 'character': 'Richard "Richie" Jerimovich', 'photo': None},
        ],
    },
    {
        'tmdbId': 70523, 'title': 'Dark', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [18, 878, 9648], 'genreNames': ['Drama', 'Science Fiction', 'Mystery'],
        'releaseYear': 2017, 'rating': 8.8, 'popularity': 83,
        'poster': 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/sugarIocMBj5tHQYdGrBQXSenDI.jpg',
        'overview': 'A missing child sets four families on a frantic hunt for answers as they unearth a sinister time travel conspiracy spanning several generations.',
        'runtime': 53,
        'cast': [
            {'name': 'Louis Hofmann', 'character': 'Jonas Kahnwald', 'photo': None},
            {'name': 'Lisa Vicari', 'character': 'Martha Nielsen', 'photo': None},
        ],
    },
    {
        'tmdbId': 95557, 'title': 'Invincible', 'type': 'series', 'tmdbType': 'tv',
        'genreIds': [16, 28, 878], 'genreNames': ['Animation', 'Action & Adventure', 'Science Fiction'],
        'releaseYear': 2021, 'rating': 8.9, 'popularity': 88,
        'poster': 'https://image.tmdb.org/t/p/w500/bGF6gLnwwISjTgM8qJbgHPlOhhq.jpg',
        'backdrop': 'https://image.tmdb.org/t/p/w1280/6UH52Fmau8RPsMAbrnYTDan3h4L.jpg',
        'overview': 'Following the story of 17-year-old Mark Grayson, who leads a seemingly normal life as a high school student — except for the fact that his father, Nolan, is the most powerful superhero on the planet.',
        'runtime': 44,
        'cast': [
            {'name': 'Steven Yeun', 'character': 'Mark Grayson / Invincible (voice)', 'photo': None},
            {'name': 'J.K. Simmons', 'character': 'Nolan Grayson / Omni-Man (voice)', 'photo': None},
        ],
    },
]

GENRE_LISTS = {
    'movie': [
        {'id': 28, 'name': 'Action'}, {'id': 12, 'name': 'Adventure'},
        {'id': 16, 'name': 'Animation'}, {'id': 35, 'name': 'Comedy'},
        {'id': 80, 'name': 'Crime'}, {'id': 99, 'name': 'Documentary'},
        {'id': 18, 'name': 'Drama'}, {'id': 14, 'name': 'Fantasy'},
        {'id': 36, 'name': 'History'}, {'id': 27, 'name': 'Horror'},
        {'id': 10402, 'name': 'Music'}, {'id': 9648, 'name': 'Mystery'},
        {'id': 10749, 'name': 'Romance'}, {'id': 878, 'name': 'Science Fiction'},
        {'id': 53, 'name': 'Thriller'}, {'id': 10752, 'name': 'War'},
    ],
    'tv': [
        {'id': 10759, 'name': 'Action & Adventure'}, {'id': 16, 'name': 'Animation'},
        {'id': 35, 'name': 'Comedy'}, {'id': 80, 'name': 'Crime'},
        {'id': 99, 'name': 'Documentary'}, {'id': 18, 'name': 'Drama'},
        {'id': 10765, 'name': 'Sci-Fi & Fantasy'}, {'id': 9648, 'name': 'Mystery'},
        {'id': 10766, 'name': 'Soap'}, {'id': 10767, 'name': 'Talk'},
        {'id': 37, 'name': 'Western'},
    ],
}


def _to_list_item(m):
    return {
        'tmdbId': m['tmdbId'],
        'title': m['title'],
        'type': m['type'],
        'tmdbType': m['tmdbType'],
        'genre': m['genreIds'],
        'releaseYear': m['releaseYear'],
        'poster': m['poster'],
        'overview': m['overview'],
        'rating': m['rating'],
        'popularity': m['popularity'],
    }


def _to_detail(m):
    similar = [
        _to_list_item(x) for x in MOVIES
        if x['tmdbId'] != m['tmdbId']
        and any(g in m['genreIds'] for g in x['genreIds'])
    ][:8]
    return {
        'tmdbId': m['tmdbId'],
        'title': m['title'],
        'type': m['type'],
        'tmdbType': m['tmdbType'],
        'genres': m.get('genreNames', []),
        'releaseYear': m['releaseYear'],
        'poster': m['poster'],
        'backdrop': m.get('backdrop') or m['poster'],
        'overview': m['overview'],
        'rating': m['rating'],
        'runtime': m.get('runtime'),
        'cast': m.get('cast', []),
        'similar': similar,
    }


def get_trending():
    sorted_movies = sorted(MOVIES, key=lambda m: m['popularity'], reverse=True)
    return [_to_list_item(m) for m in sorted_movies]


def search_multi(query, page=1):
    q = (query or '').lower()
    filtered = [
        _to_list_item(m) for m in MOVIES
        if q in m['title'].lower()
        or q in m['overview'].lower()
        or any(q in g.lower() for g in m['genreNames'])
    ]
    return paginate(filtered, page)


def get_movie_details(tmdb_id):
    for m in MOVIES:
        if str(m['tmdbId']) == str(tmdb_id):
            return _to_detail(m)
    return None


def get_by_genre(genre_id, type_='movie', page=1):
    media_type = 'series' if type_ == 'tv' else 'movie'
    filtered = [
        m for m in MOVIES
        if m['type'] == media_type and int(genre_id) in m['genreIds']
    ]
    filtered.sort(key=lambda m: m['popularity'], reverse=True)
    return paginate([_to_list_item(m) for m in filtered], page)


def get_genre_list(type_='movie'):
    return GENRE_LISTS.get(type_, GENRE_LISTS['movie'])
