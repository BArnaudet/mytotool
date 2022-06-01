var express = require('express');
var router = express.Router();
var dbConn  = require('../db');
 
// Afficher les tâches
router.get('/', function(req, res, next) {

    dbConn.query('SELECT * FROM tasks ORDER BY id asc',function(err,rows) {
        if(err) {
            req.flash('error', err);
            res.render('tasks',{data:''});
        } else {
            res.render('tasks',{data:rows});
        }
    });
});

router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('tasks/add', {
        client: '',
        projet: '',
        date: ''     
    })
})

// Ajouter un projet
router.post('/add', function(req, res, next) {    

    let client = req.body.client;
    let projet = req.body.projet;
    let date = req.body.date;
    let errors = false;

    if(client.length === 0 || projet.length === 0) {
        errors = true;
        res.render('tasks/add', {
            client: client,
            projet: projet,
            date: date
        })
    }

    if(!errors) {

        var form_data = {
            client: client,
            projet: projet,
            date: date
        }
        
        dbConn.query('INSERT INTO tasks SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)                 
                res.render('tasks/add', {
                    client: form_data.client,
                    projet: form_data.projet,
                    date: form-date.date                   
                })
            } else {                
                req.flash('success', 'Tâche ajoutée');
                res.redirect('/tasks');
            }
        })
    }
})

router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM tasks WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', "Tâche non trouvée avec l'id = " + id)
            res.redirect('/tasks')
        }
        else {
            // render to edit.ejs
            res.render('tasks/edit', {
                title: 'Edit tasks', 
                id: rows[0].id,
                client: rows[0].client,
                projet: rows[0].projet,
                date: rows[0].date
            })
        }
    })
})

// Modifier un projet
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let client = req.body.client;
    let projet = req.body.projet;
    let date = req.body.date
    let errors = false;

    if(client.length === 0 || projet.length === 0) {
        errors = true;
        
        req.flash('error', "Merci de remplir les informations demandées");
        res.render('tasks/edit', {
            id: req.params.id,
            client: client,
            projet: projet,
            date: date
        })
    }

    if( !errors ) {   
 
        var form_data = {
            client: client,
            projet: projet,
            date: date
        }
        dbConn.query('UPDATE tasks SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('tasks/edit', {
                    id: req.params.id,
                    client: form_data.client,
                    projet: form_data.projet,
                    date: form_data.date
                })
            } else {
                req.flash('success', 'Tâche mise à jour');
                res.redirect('/tasks');
            }
        })
    }
})
   
// Supprimer un projet
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM tasks WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            res.redirect('/tasks')
        } else {
            // set flash message
            req.flash('success', 'Tâche supprimée')
            res.redirect('/tasks')
        }
    })
})

module.exports = router;