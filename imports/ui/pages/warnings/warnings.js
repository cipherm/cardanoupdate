import './warnings.html'
 import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Warnings } from '/imports/api/warnings/warnings'
 import { deleteWarning, proposeNewDataWarning, flagWarning } from '/imports/api/warnings/methods'
import swal from 'sweetalert2'
 import { notify } from '/imports/modules/notifier'
 Template.warnings.onCreated(function () {
    this.sort = new ReactiveVar('date-desc')
    this.searchFilter = new ReactiveVar(undefined);
    
    this.autorun(() => {
        this.subscribe('warnings')
    })
})
 Template.warnings.helpers({
  warningCount () {
    let warnings = 0;
    let searchText = Template.instance().searchFilter.get()
      // Check if user has searched for something
    if (searchText != undefined && searchText != '') {
      warnings = Warnings.find({
      $or: [{
          summary: new RegExp(searchText.replace(/ /g, '|'), 'ig')
      }, {
          headline: new RegExp(searchText.replace(/ /g, '|'), 'ig')
      }, {
          tags: new RegExp(searchText.replace(/ /g, '|'), 'ig')
      }]
    }).count()
    } else {
      warnings = Warnings.find({}).count()
    }
    return warnings
  },
     warnings () {
      let warnings = [];
      let searchText = Template.instance().searchFilter.get()
        // Check if user has searched for something
      if (searchText != undefined && searchText != '') {
          warnings = Warnings.find({
          $or: [{
              summary: new RegExp(searchText.replace(/ /g, '|'), 'ig')
          }, {
              headline: new RegExp(searchText.replace(/ /g, '|'), 'ig')
          }, {
              tags: new RegExp(searchText.replace(/ /g, '|'), 'ig')
          }]
      })
      } else {
          warnings = Warnings.find({})
      }
      return warnings
    },
})
 Template.warnings.events({
     // Remove comments if user is allowed to propose changes
    /*
    'click .github': function(event, temlateInstance) {
        if ($(event.currentTarget).attr('href')) {
            return
        }
         swal({
            text: `GitHub repo is not available. If you know this information, please contribute below:`,
            type: 'warning',
            showCancelButton: true,
            input: 'text'
        }).then(val => {
            if (val.value) {
                proposeNewDataWarning.call({
                    projectId: this._id,
                    datapoint: 'github_url',
                    newData: val.value,
                    type: 'link'
                }, (err, data) => {
                    if (err) {
                        notify(err.reason || err.message, 'error')
                    } else {
                        notify('Successfully contributed.', 'success')
                    }
                })
            }
        })
    },
    'click .website': function(event, temlateInstance) {
        if ($(event.currentTarget).attr('href')) {
            return
        }
         swal({
            text: `Website is not available. If you know this information, please contribute below:`,
            type: 'warning',
            showCancelButton: true,
            input: 'text'
        }).then(val => {
            if (val.value) {
                proposeNewDataWarning.call({
                    projectId: this._id,
                    datapoint: 'website',
                    newData: val.value,
                    type: 'link'
                }, (err, data) => {
                    if (err) {
                        notify(err.reason || err.message, 'error')
                    } else {
                        notify('Successfully contributed.', 'success')
                    }
                })
            }
        })
    },
    */
     'click #add-warning': (event, _) => {
        event.preventDefault()
        FlowRouter.go('/scams/new')
    },
    'keyup #searchBox': function (event, templateInstance) {
      event.preventDefault();
       templateInstance.searchFilter.set($('#searchBox').val())
    },
})