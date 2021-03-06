/*
 * Copyright (C) 2012-2014 Bitergia
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * This file is a part of the VizGrimoireJS package
 *
 * Authors:
 *   Alvaro del Castillo San Felix <acs@bitergia.com>
 */

// TODO: Use attributes for getters and setters

function DataSource(name, basic_metrics) {

    this.top_data_file = this.data_dir + '/'+this.name+'-top.json';
    this.getTopDataFile = function() {
        return this.top_data_file;
    };

    this.getMetrics = function() {return this.basic_metrics;};
    this.setMetrics = function(metrics) {this.basic_metrics = metrics;};
    this.getMetricDesc = function(metric_id) {
        var metric_data = this.basic_metrics[metric_id];
        if (metric_data !== undefined && metric_data.desc !== undefined){
            return metric_data.desc;
        }
        else{
            return '';
        }
    };

    this.setMetricsDefinition = function(metrics) {
        if (metrics === undefined) return;
        this.setMetrics(metrics);
    };

    this.data_file = this.data_dir + '/'+this.name+'-evolutionary.json';
    this.getDataFile = function() {
        return this.data_file;
    };
    this.setDataFile = function(file) {
        this.data_file = file;
    };

    this.data = null;
    this.getData = function() {
        return this.data;
    };

    function nameSpaceMetrics(plain_metrics, ds) {
        // If array, no data available
        if (plain_metrics instanceof Array)
            return plain_metrics;
        var metrics = {};
        if (plain_metrics === null) {
            return metrics;
        }
        $.each(plain_metrics, function (name, value) {
            var basic_name = name;
            // commits_7, commits_30 ....
            var aux = name.split("_");
            if (isNaN(aux[aux.length-1]) === false)
                basic_name = aux.slice(0,aux.length-1).join("_");
            var ns_basic_name = ds.getName()+"_"+basic_name;
            var ns_name = ds.getName()+"_"+name;
            if ((ds.getMetrics()[ns_basic_name] === undefined) && (name !== 'submissions'))
                metrics[name] = value;
            else metrics[ns_name] = value;
        });
        return metrics;
    }

    this.setData = function(load_data, self) {
        if (self === undefined) self = this;
        self.data = nameSpaceMetrics(load_data, self);
    };

    this.demographics_aging_file = this.data_dir + '/'+this.name+'-demographics-aging.json';
    this.demographics_birth_file = this.data_dir + '/'+this.name+'-demographics-birth.json';
    this.getDemographicsAgingFile = function() {
        return this.demographics_aging_file;
    };
    this.getDemographicsBirthFile = function() {
        return this.demographics_birth_file;
    };

    this.demographics_data = {};
    this.getDemographicsData = function() {
        return this.demographics_data;
    };
    this.setDemographicsAgingData = function(data, self) {
        if (self === undefined) self = this;
        self.demographics_data.aging = data;
    };

    this.setDemographicsBirthData = function(data, self) {
        if (self === undefined) self = this;
        self.demographics_data.birth = data;
    };

    this.data_dir = 'data/json';
    this.getDataDir = function() {
        return this.data_dir;
    };
    this.setDataDir = function(dataDir) {
        this.data_dir = dataDir;
        this.data_file = dataDir + '/'+this.name+'-evolutionary.json';
        this.demographics_aging_file = dataDir + '/'+this.name+'-demographics-aging.json';
        this.demographics_birth_file = dataDir + '/'+this.name+'-demographics-birth.json';
        this.global_data_file = dataDir + '/'+this.name+'-static.json';
        this.top_data_file = dataDir + '/'+this.name+'-top.json';
        this.companies_data_file = dataDir+'/'+ this.name +'-organizations.json';
        this.repos_data_file = dataDir+'/'+ this.name +'-repos.json';
        this.countries_data_file = dataDir+'/'+ this.name +'-countries.json';
        this.domains_data_file = dataDir+'/'+ this.name +'-domains.json';
        this.projects_data_file = dataDir+'/'+ this.name +'-projects.json';
        this.time_to_fix_data_file = dataDir+'/'+ this.name +'-quantiles-month-time_to_fix_hour.json';
    };

    this.global_data_file = this.data_dir + '/'+this.name+'-static.json';
    this.getGlobalDataFile = function() {
        return this.global_data_file;
    };

    this.global_data = null;
    this.getGlobalData = function() {
        return this.global_data;
    };
    /*
    * Stores data object in self.global_data. If companies are being filtered
    * out via dashboard configuration, it modifies the number of companies.
    * @param {object()} data - Object based on [ds_name]-static.json
    */
    this.setGlobalData = function(data, self) {
        if (self === undefined) self = this;

        var aux = Report.getMenuElements();
        var active_companies = null;

        if (aux && typeof aux.filter_companies !== undefined) {
            active_companies = aux.filter_companies;
        }

        if (active_companies && (active_companies.length > 0)
            && (Object.keys(data).indexOf('companies') >=0)){
            data.companies = active_companies.length;
        }

        self.global_data = nameSpaceMetrics(data, self);
    };

    this.global_top_data = null;
    this.getGlobalTopData = function() {
        return this.global_top_data;
    };
    this.setGlobalTopData = function(data, self) {
        if (self === undefined) self = this;
        self.global_top_data = data;
    };
    this.name = name;
    this.getName = function() {
        return this.name;
    };

    this.people_data_file = this.data_dir + '/'+this.name+'-people.json';
    this.getPeopleDataFile = function() {
        return this.people_data_file;
    };
    this.people = null;
    this.getPeopleData = function() {
        return this.people;
    };
    this.setPeopleData = function(people, self) {
        if (self === undefined) self = this;
        self.people = people;
    };

    this.time_to_fix_data_file = this.data_dir + '/'+this.name
            + '-quantiles-month-time_to_fix_hour.json';
    this.getTimeToFixDataFile = function() {
        return this.time_to_fix_data_file;
    };
    this.time_to_fix_data = null;
    this.getTimeToFixData = function() {
        return this.time_to_fix_data;
    };
    this.setTimeToFixData = function(data, self) {
        if (self === undefined) self = this;
        self.time_to_fix_data = data;
    };

    this.time_to_attention_data_file = this.data_dir + '/'+this.name
            + '-quantiles-month-time_to_attention_hour.json';
    this.getTimeToAttentionDataFile = function() {
        return this.time_to_attention_data_file;
    };
    this.time_to_attention_data = null;
    this.getTimeToAttentionData = function() {
        return this.time_to_attention_data;
    };
    this.setTimeToAttentionData = function(data, self) {
        if (self === undefined) self = this;
        self.time_to_attention_data = data;
    };

    this.project = null;
    this.getProject = function() {
        return this.project;
    };
    this.setProject = function(project) {
        this.project = project;
    };

    this.markov_table_data_file = this.data_dir + '/' + this.name + '-markov.json';
    this.getMarkovTableDataFile = function() {
        return this.markov_table_data_file;
    };
    this.markov_table_data = null;
    this.getMarkovTableData = function() {
        return this.markov_table_data;
    };
    this.setMarkovTableData = function(data, self) {
        if (self === undefined) self = this;
        self.markov_table_data = data;
    };

    // Companies data
    this.companies_data_file = this.data_dir+'/'+ this.name +'-organizations.json';
    this.getCompaniesDataFile = function() {
        return this.companies_data_file;
    };

    this.companies = null;
    this.getCompaniesDataFull = function() {
        return this.companies;
    };

    this.getCompaniesData = function() {
        var items = this.companies;
        if  (items instanceof Array === false) {
            // New format with names and metrics
            if (this.companies !== null) {
                items = this.companies.name;
            }
        }
        return items;
    };

    /*
    * Returns an Array filtering out the companies not included in the dash
    * conf.
    * @param {string[]} com_data - list of company names
    */
    function filterOutCompaniesArray(com_data){
        var aux = Report.getMenuElements(),
            active_companies = null,
            result = [];

        if (aux && typeof(aux.filter_companies) !== undefined) {
            active_companies = aux.filter_companies;
        }
        if (active_companies && active_companies.length > 0){
            $.each(com_data, function(pos, name){
                //is name in array
                if (active_companies.indexOf(name) >= 0){
                    result[result.length] = name;
                }
            });
        }else{
            result = com_data;
        }
        return result;
    }

    /*
    * Returns an object filtering out the companies that are not included in
    * the configuration of the dash
    * @param {object()} com_data - Object with keys name and metrics name
    */
    function filterOutCompanies (com_data){
        var aux = Report.getMenuElements();
        var active_companies = null;

        if (aux && typeof(aux.filter_companies) !== undefined) {
            active_companies = aux.filter_companies;
        }

        if (active_companies && active_companies.length > 0){
            var keys = Object.keys(com_data); //one of them is name
            // first we get the position where enabled companies are
            var positions = [];
            $.each(com_data.name, function(pos, name){
                //is name in array
                if (active_companies.indexOf(name) >= 0){
                    positions[positions.length] = pos;
                }
            });

            var new_obj = {};
            $.each(keys, function(id, k){
                new_obj[k] = [];
                $.each(positions, function(subid, pos){
                    var l = new_obj[k].length;
                    new_obj[k][l] = com_data[k][pos];
                });
            });
            com_data = new_obj;
        }
        return com_data;
    }

    /*
    * WARNING: strange code. Companies can be an object or an array.
    * We are filtering the companies based on configuration file,
    * it seems it is enough filtering when 'companies' is an object.
    * What the hell is the array? Pretty good question.
    */
    this.setCompaniesData = function(companies, self) {
        if (companies === null) companies = [];
        if (self === undefined) self = this;
        if (Array.isArray(companies)){
            //JSON API is broken for SCR data source so we need this hack
            self.companies = filterOutCompaniesArray(companies);
        }
        else if(typeof(companies) === 'object'){
            self.companies = filterOutCompanies(companies);
        }
    };

    this.companies_metrics_data = {};
    this.addCompanyMetricsData = function(company, data, self) {
        if (self === undefined) self = this;
        self.companies_metrics_data[company] = nameSpaceMetrics(data, self);
    };
    this.getCompaniesMetricsData = function() {
        return this.companies_metrics_data;
    };

    this.companies_global_data = {};
    this.addCompanyGlobalData = function(company, data, self) {
        if (self === undefined) self = this;
        self.companies_global_data[company] = nameSpaceMetrics(data, self);
    };
    this.getCompaniesGlobalData = function() {
        return this.companies_global_data;
    };

    this.companies_top_data = {};
    this.addCompanyTopData = function(company, data, self) {
        if (self === undefined) self = this;
        if (self.companies_top_data[company] === undefined)
            self.companies_top_data[company] = {};
        self.companies_top_data[company] = data;
    };
    this.getCompaniesTopData = function() {
        return this.companies_top_data;
    };
    this.setCompaniesTopData = function(data, self) {
        if (self === undefined) self = this;
        self.companies_top_data = data;
    };

    // Repos data
    this.repos_data_file =
        this.data_dir+'/'+ this.name +'-repos.json';
    this.getReposDataFile = function() {
        return this.repos_data_file;
    };

    this.repos = null;
    this.getReposDataFull = function() {
        return this.repos;
    };
    this.getReposData = function() {
        var items = this.repos;
        if  (items instanceof Array === false) {
            // New format with names and metrics
            if (this.repos !== null) {
                items = this.repos.name;
            }
        }
        return items;
    };
    this.setReposData = function(repos, self) {
        if (self === undefined) self = this;
        self.repos = repos;
        if (self.getName() !== "its") return;

        repos_names = [];
        if  (repos instanceof Array === true) {
            self.repos = {};
            self.repos.name = repos;
        }

        var filtered_repos = [];
        // convert http://issues.liferay.com/browse/AUI, change "/" by "_"
        for (var i=0; i<self.repos.name.length; i++) {
            filtered_repos.push(self.repos.name[i].replace(/\//g,"_"));
        }
        self.repos.name = filtered_repos;
    };

    this.repos_metrics_data = {};
    this.addRepoMetricsData = function(repo, data, self) {
        if (self === undefined) self = this;
        self.repos_metrics_data[repo] = nameSpaceMetrics(data, self);
    };
    this.getReposMetricsData = function() {
        return this.repos_metrics_data;
    };

    this.repos_global_data = {};
    this.addRepoGlobalData = function(repo, data, self) {
        if (self === undefined) self = this;
        self.repos_global_data[repo] =  nameSpaceMetrics(data, self);
    };
    this.getReposGlobalData = function() {
        return this.repos_global_data;
    };

    // Repos + top
    this.repositories_top_data = {};
    this.addRepositoryTopData = function(repository, data, self) {
        if (self === undefined) self = this;
        if (self.repositories_top_data[repository] === undefined)
            self.repositories_top_data[repository] = {};
        self.repositories_top_data[repository] = data;
    };
    this.getRepositoriesTopData = function() {
        return this.repositories_top_data;
    };
    this.setRepositoriesTopData = function(data, self) {
        if (self === undefined) self = this;
        self.repositories_top_data = data;
    };

    // Countries data
    this.countries_data_file =
        this.data_dir+'/'+ this.name +'-countries.json';
    this.getCountriesDataFile = function() {
        return this.countries_data_file;
    };

    this.countries = null;
    this.getCountriesData = function() {
        var items = this.countries;
        if  (items instanceof Array === false) {
            // New format with names and metrics
            if (this.countries !== null) {
                items = this.countries.name;
            }
        }
        return items;
    };
    this.setCountriesData = function(countries, self) {
        if (self === undefined) self = this;
        self.countries = countries;
    };

    this.countries_metrics_data = {};
    this.addCountryMetricsData = function(country, data, self) {
        if (self === undefined) self = this;
        self.countries_metrics_data[country] = nameSpaceMetrics(data, self);
    };
    this.getCountriesMetricsData = function() {
        return this.countries_metrics_data;
    };

    this.countries_global_data = {};
    this.addCountryGlobalData = function(country, data, self) {
        if (self === undefined) self = this;
        self.countries_global_data[country] = nameSpaceMetrics(data, self);
    };
    this.getCountriesGlobalData = function() {
        return this.countries_global_data;
    };

    // Domains
    this.domains_data_file =
        this.data_dir+'/'+ this.name +'-domains.json';
    this.getDomainsDataFile = function() {
        return this.domains_data_file;
    };

    this.domains = null;
    this.getDomainsDataFull = function() {
        return this.domains;
    };

    this.getDomainsData = function() {
        var items = this.domains;
        if  (items instanceof Array === false) {
            // New format with names and metrics
            if (this.domains !== null) {
                items = this.domains.name;
            }
        }
        return items;
    };
    this.setDomainsData = function(domains, self) {
        if (domains === null) domains = [];
        if (self === undefined) self = this;
        self.domains = domains;
    };

    this.domains_metrics_data = {};
    this.addDomainMetricsData = function(domain, data, self) {
        if (self === undefined) self = this;
        self.domains_metrics_data[domain] = nameSpaceMetrics(data, self);
    };
    this.getDomainsMetricsData = function() {
        return this.domains_metrics_data;
    };

    this.domains_global_data = {};
    this.addDomainGlobalData = function(domain, data, self) {
        if (self === undefined) self = this;
        self.domains_global_data[domain] =  nameSpaceMetrics(data, self);
    };
    this.getDomainsGlobalData = function() {
        return this.domains_global_data;
    };

    // Projects
    this.projects_data_file =
        this.data_dir+'/'+ this.name +'-projects.json';
    this.getProjectsDataFile = function() {
        return this.projects_data_file;
    };

    this.projects = null;
    this.getProjectsData = function() {
        var items = this.projects;
        if  (items instanceof Array === false) {
            // New format with names and metrics
            if (this.projects !== null) {
                items = this.projects.name;
            }
        }
        return items;
    };

    this.setProjectsData = function(projects, self) {
        if (projects === null) projects = [];
        if (self === undefined) self = this;
        self.projects = projects;
    };

    this.projects_metrics_data = {};
    this.addProjectMetricsData = function(project, data, self) {
        if (self === undefined) self = this;
        self.projects_metrics_data[project] = nameSpaceMetrics(data, self);
    };
    this.getProjectsMetricsData = function() {
        return this.projects_metrics_data;
    };

    this.projects_global_data = {};
    this.addProjectGlobalData = function(project, data, self) {
        if (self === undefined) self = this;
        self.projects_global_data[project] =  nameSpaceMetrics(data, self);
    };
    this.getProjectsGlobalData = function() {
        return this.projects_global_data;
    };

    // people
    this.people_metrics_data = {};
    this.addPeopleMetricsData = function(id, data, self) {
        if (self === undefined) self = this;
        self.people_metrics_data[id] = nameSpaceMetrics(data, self);
    };
    this.getPeopleMetricsData = function() {
        return this.people_metrics_data;
    };

    this.people_global_data = {};
    this.addPeopleGlobalData = function(id, data, self) {
        if (self === undefined) self = this;
        self.people_global_data[id] = nameSpaceMetrics(data, self);
    };
    this.getPeopleGlobalData = function() {
        return this.people_global_data;
    };


    // TODO: Move this logic to Report
    this.getCompanyQuery = function () {
        var company = null;
        var querystr = window.location.search.substr(1);
        if (querystr  &&
                querystr.split("&")[0].split("=")[0] === "company")
            company = querystr.split("&")[0].split("=")[1];
        return company;
    };

    this.displayMetricCompanies = function(metric_id,
            div_target, config, start, end) {
        var companies_data = this.getCompaniesMetricsData();
        Viz.displayMetricCompanies(metric_id, companies_data,
                div_target, config, start, end);
    };

    this.displayMetricMyCompanies = function(companies, metric_id,
            div_target, config, start, end) {
        var companies_data = {};
        var self = this;
        $.each(companies, function(i,name) {
            companies_data[name] = self.getCompaniesMetricsData()[name];
        });
        Viz.displayMetricCompanies(metric_id, companies_data,
                div_target, config, start, end);
    };

    // TODO: mix with displayMetricCompanies
    this.displayMetricRepos = function(metric_id,
            div_target, config, start, end) {
        var repos_data = this.getReposMetricsData();
        Viz.displayMetricRepos(metric_id, repos_data,
                div_target, config, start, end);
    };

    // Includes repos mapping for actionable dashboard comparison
    this.displayBasicMetricMyRepos = function(repos, metric_id,
            div_target, config, start, end) {
        var repos_data = {};
        var reposMap = Report.getReposMap();
        var self = this;
        $.each(repos, function(i,name) {
            var metrics = self.getReposMetricsData()[name];
            if (!metrics) {
                if (reposMap[name] instanceof Object) {
                    // New format: name: {scm:name, its:name ...}
                    name = reposMap[name][self.getName()];
                } else {
                    //  Old format: scm:its
                    name = reposMap[name];
                }
                metrics = self.getReposMetricsData()[name];
            }
            repos_data[name] = metrics;
        });
        Viz.displayMetricRepos(metric_id, repos_data,
                div_target, config, start, end);
    };

    this.displayMetricDomains = function(metric_id,
            div_target, config, start, end) {
        var domains_data = this.getDomainsMetricsData();
        Viz.displayMetricDomains(metric_id, domains_data,
                div_target, config, start, end);
    };

    this.displayMetricProjects = function(metric_id,
            div_target, config, start, end) {
        var projects_data = this.getProjectsMetricsData();
        Viz.displayMetricProjects(metric_id, projects_data,
                div_target, config, start, end);
    };

    this.displayMetricCompaniesStatic = function (metric_id,
            div_target, config, order_by, show_others) {
        this.displayMetricSubReportStatic ("companies",metric_id,
                div_target, config, order_by, show_others);
    };

    this.displayMetricReposStatic = function (metric_id,
            div_target, config, order_by, show_others) {
        this.displayMetricSubReportStatic ("repos", metric_id,
                div_target, config, order_by, show_others);
    };

    this.displayMetricCountriesStatic = function (metric_id,
          div_target, config, order_by, show_others) {
        this.displayMetricSubReportStatic ("countries", metric_id,
            div_target, config, order_by, show_others);
    };

    this.displayMetricDomainsStatic = function (metric_id,
            div_target, config, order_by, show_others) {
        this.displayMetricSubReportStatic ("domains",metric_id,
                div_target, config, order_by, show_others);
    };

    this.displayMetricProjectsStatic = function (metric_id,
            div_target, config, order_by, show_others) {
        this.displayMetricSubReportStatic ("projects",metric_id,
                div_target, config, order_by, show_others);
    };

    this.displayMetricSubReportStatic = function (report, metric_id,
            div_target, config, order_by, show_others) {
        if (order_by === undefined) order_by = metric_id;
        var data = null;
        if (report=="companies")
            data = this.getCompaniesGlobalData();
        else if (report=="repos")
            data = this.getReposGlobalData();
        else if (report=="countries")
          data = this.getCountriesGlobalData();
        else if (report=="domains")
            data = this.getDomainsGlobalData();
        else if (report=="projects")
            data = this.getProjectsGlobalData();
        else return;

        if ($.isEmptyObject(data)) return;

        // Ordered also done in Report.js
        var order = DataProcess.sortGlobal(this, order_by, report);
        // Hack because different formats
        if (order instanceof Array === false) {order = order.name;}
        data_page = DataProcess.paginate(order, Report.getCurrentPage());

        Viz.displayMetricSubReportStatic(metric_id, data, data_page,
            div_target, config);
    };

    this.displayMetricsCompany = function (
            company, metrics, div_id, config) {
        var data = this.getCompaniesMetricsData()[company];
        if (data === undefined) {
            $("#"+div_id).hide();
            return;
        }
        Viz.displayMetricsCompany(this, company, metrics, data, div_id, config);
    };

    this.displayMetricsRepo = function (repo, metrics, div_id, config, convert) {
        var data = this.getReposMetricsData()[repo];
        if (data === undefined) {
            $("#"+div_id).hide();
            return;
        }
        if (convert) {
            data = DataProcess.convert(data, convert, metrics);
            if (convert === "divide") {
                mlabel = this.getMetrics()[metrics[0]].name+"/";
                mlabel += this.getMetrics()[metrics[1]].name;
                //metric_ids = ['divide'];
                metrics = ['divide'];
                // Add the new metric to the data source with its legend
                this.getMetrics().divide = {"name":mlabel};
            }
            if (convert === "substract") {
                mlabel = this.getMetrics()[metrics[0]].name+"-";
                mlabel += this.getMetrics()[metrics[1]].name;
                //metric_ids = ['substract'];
                metrics = ['substract'];
                // Add the new metric to the data source with its legend
                this.getMetrics().substract = {"name":mlabel};
            }
        }
        Viz.displayMetricsRepo(this, repo, metrics, data, div_id, config);
    };

    this.displayMetricsCountry = function (country, metrics, div_id, config) {
        var data = this.getCountriesMetricsData()[country];
        if (data === undefined) {
            $("#"+div_id).hide();
            return;
        }
        Viz.displayMetricsCountry(this, country, metrics, data, div_id, config);
    };

    this.displayMetricsDomain = function (domain, metrics, div_id, config) {
        var data = this.getDomainsMetricsData()[domain];
        if (data === undefined) return;
        Viz.displayMetricsDomain(this, domain, metrics, data, div_id, config);
    };

    this.displayMetricsProject = function (project, metrics, div_id, config) {
        var data = this.getProjectsMetricsData()[project];
        if (data === undefined) return;
        Viz.displayMetricsProject(this, project, metrics, data, div_id, config);
    };

    this.displayMetricsPeople = function (upeople_id, upeople_identifier, metrics, div_id, config) {
        var history = this.getPeopleMetricsData()[upeople_id];
        if (history === undefined || history instanceof Array) {
            $("#"+div_id).hide();
            return;
        }
        Viz.displayMetricsPeople(this, upeople_identifier, metrics, history, div_id, config);
    };

    // TODO: support multiproject
    this.displayMetricsEvol = function(metric_ids, div_target, config, convert) {
        var data = {};
        var repositories;
        //if we get a repo name, we display its history
        if (config.repo_filter){
            repositories = config.repo_filter.split(',');
            var self = this; //we need it for the loop $.each
            $.each(repositories, function(id, value){
                if (($.inArray(value, self.getReposData()) >= 0)){
                    if (self.getName() === 'mls'){
                        //var mls_name = self.displayMLSListName(value);
                        var mls_name = MLS.displayMLSListName(value);
                        data[mls_name] = self.getReposMetricsData()[value];
                    }else{
                        data[value] = self.getReposMetricsData()[value];
                    }
                }
            });
        }
        else{
            data = this.getData();
        }
        if (convert) {
            data = DataProcess.convert(data, convert, metric_ids);
            if (convert === "divide") {
                mlabel = this.getMetrics()[metric_ids[0]].name+"/";
                mlabel += this.getMetrics()[metric_ids[1]].name;
                metric_ids = ['divide'];
                // Add the new metric to the data source with its legend
                this.getMetrics().divide = {"name":mlabel};
            }
            if (convert === "substract") {
                mlabel = this.getMetrics()[metric_ids[0]].name+"-";
                mlabel += this.getMetrics()[metric_ids[1]].name;
                metric_ids = ['substract'];
                // Add the new metric to the data source with its legend
                this.getMetrics().substract = {"name":mlabel};
            }
        }
        Viz.displayMetricsEvol(this, metric_ids, data, div_target, config, repositories);
    };

    this.isPageDisplayed = function (visited, linked, total, displayed) {
        // Returns true if link page should be displayed.
        // Receive: number of visited page,
        //   number of page to be displayed,
        //   total number of pages,
        //   number of pages to be displayed

        var window = Math.floor((displayed - 3)/2);
        var lowest_barrier = visited - window;
        var highest_barrier = (visited + window);


        if ((linked === 1) || (linked === total) || (linked == visited)){
            return true;
        }
        //else if ((linked >= (visited - window)) || (linked <= (visited + window))) {
        else if ((linked >= lowest_barrier) && (linked < visited)){
            return true;
        }
        else if ((linked <= highest_barrier) && (linked > visited)){
            return true;
        }
        else{
            return false;
        }
    };

    this.displayItemsNav = function (div_nav, type, page_str, order_by) {
        var page = parseInt(page_str, null);
        if (isNaN(page)) page = 1;
        var items = null;
        var title = "";
        var total = 0;
        var displayed_pages = 5; // page displayed in the paginator
        if (type === "companies") {
            items = this.getCompaniesData();
            title = "List of companies";
        } else if (type === "repos") {
            items = this.getReposData();
            if (order_by)
                items = DataProcess.sortGlobal(this, order_by, type);
        } else if (type === "countries") {
            items = this.getCountriesData();
        } else if (type === "domains") {
            items = this.getDomainsData();
        } else if (type === "projects") {
            items = this.getProjectsData();
        } else {
            return;
        }

        total = items.length;

        var nav = '';
        var psize = Report.getPageSize();
        if (page) {
            nav += "<div class='pagination'>";
            var number_pages = Math.ceil(total/psize);
            // number to compose the text message (from_item - to_item / total)
            var from_item = ((page-1) * psize) + 1;
            var to_item = page * psize;
            if (to_item > total){
                to_item = total;
            }

            // Bootstrap
            nav += "<ul class='pagination'>";
            if (page>1) {
                if(Utils.isReleasePage()) {
                    nav += "<li><a href='" + Utils.createReleaseLink("?page="+(page-1)) + "'>&laquo;</a></li>";
                }
                else{
                    nav += "<li><a href='?page="+(page-1)+"'>&laquo;</a></li>";
                }
            }
            else{
                if(Utils.isReleasePage()) {
                    nav += "<li class='disabled'><a href='" + Utils.createReleaseLink("?page="+(page)) + "'>&laquo;</a></li>";
                }
                else{
                    nav += "<li class='disabled'><a href='?page="+(page)+"'>&laquo;</a></li>";
                }
            }

            for (var j=0; j*Report.getPageSize()<total; j++) {
                if (this.isPageDisplayed(page, (j+1), number_pages, displayed_pages) === true){
                    if (page === (j+1)) {
                        if(Utils.isReleasePage()) {
                            nav += "<li class='active'><a href='" + Utils.createReleaseLink("?page="+(j+1))+"'>" + (j+1) + "</a></li>";
                        }
                        else{
                            nav += "<li class='active'><a href='?page="+(j+1)+"'>" + (j+1) + "</a></li>";
                        }
                    }
                    else {
                        if(Utils.isReleasePage()){
                            nav += "<li><a href='" + Utils.createReleaseLink("?page="+(j+1))+"'>" + (j+1) + "</a></li>";
                        }else{
                            nav += "<li><a href='?page="+(j+1)+"'>" + (j+1) + "</a></li>";
                        }
                    }
                }
                else {
                    // if it is next to the last page or the second and is not displayed, we add the '..'
                    if ( ((j+1+1) === number_pages) || ((j+1-1) === 1) ){
                        nav += "<li class='disabled'><a href='#'> .. </a></li>";
                    }
                }
            }
            if (page*Report.getPageSize()<items.length) {
                if(Utils.isReleasePage()){
                    nav += "<li><a href='" + Utils.createReleaseLink("?page="+(parseInt(page,null)+1)) + "'>";
                }
                else{
                    nav += "<li><a href='?page="+(parseInt(page,null)+1)+"'>";
                }
                nav += "&raquo;</a></li>";
            }
            nav += "</ul>";
            nav += "<span class='pagination-text'> (" + from_item +" - "+ to_item + "/" + total+ ")</span>";
            nav += "</div>";
        }
        //nav += "<span id='nav'></span>";
        // Show only the items navbar when there are more than 10 items
        if (Report.getPageSize()>10)
            $.each(items, function(id, item) {
                var label = Report.cleanLabel(item);
                nav += "<a href='#"+item+"-nav'>"+label + "</a> ";
            });
        $("#"+div_nav).append(nav);
    };

    this.displayCompaniesLinks = function (div_links, limit, sort_metric) {
        var sorted_companies = DataProcess.sortGlobal(this, sort_metric, "companies");
        var links = "";
        var i = 0;
        $.each(sorted_companies, function(id, company) {
            links += '<a href="company.html?company='+company;
            if (Report.addDataDir())
                links += '&'+Report.addDataDir();
            links += '">'+company+'</a>| ';
            if (i++>=limit-1) return false;
        });
        $("#"+div_links).append(links);
    };

    this.displayCompaniesList = function (metrics,div_id,
            config_metric, sort_metric, page, show_links, start, end, convert) {
        this.displaySubReportList("companies",metrics,div_id,
                config_metric, sort_metric, page, show_links, start, end, convert);
    };

    this.displayReposList = function (metrics,div_id,
            config_metric, sort_metric, page, show_links, start, end, convert,
            ds_realname) {
        this.displaySubReportList("repos",metrics,div_id,
                config_metric, sort_metric, page, show_links, start, end, convert,
                ds_realname);
    };

    this.displayCountriesList = function (metrics,div_id,
            config_metric, sort_metric, page, show_links, start, end, convert) {
        this.displaySubReportList("countries",metrics,div_id,
                config_metric, sort_metric, page, show_links, start, end, convert);
    };

    this.displayDomainsList = function (metrics,div_id,
            config_metric, sort_metric, page, show_links, start, end, convert) {
        this.displaySubReportList("domains",metrics,div_id,
                config_metric, sort_metric, page, show_links, start, end, convert);
    };

    this.displayProjectsList = function (metrics,div_id,
            config_metric, sort_metric, page, show_links, start, end, convert) {
        this.displaySubReportList("projects",metrics,div_id,
                config_metric, sort_metric, page, show_links, start, end, convert);
    };

    this.displaySubReportList = function (report, metrics,div_id,
            config_metric, sort_metric, page_str, show_links, start, end, convert,
            ds_realname) {

        var page = parseInt(page_str, null);
        if (isNaN(page)) page = 1;
        var list = "";
        var cont = ( page - 1 ) * Report.getPageSize() + 1;
        var ds = this;
        var data = null, sorted = null;
        if (show_links === undefined) show_links = true;
        if (report === "companies") {
            data = this.getCompaniesMetricsData();
            sorted = DataProcess.sortGlobal(this, sort_metric, report);
        }
        else if (report === "repos") {
            data = this.getReposMetricsData();
            sorted = DataProcess.sortGlobal(this, sort_metric, report);
        }        else if (report === "countries") {
            data = this.getCountriesMetricsData();
            sorted = DataProcess.sortGlobal(this, sort_metric, report);
        }
        else if (report === "domains") {
            data = this.getDomainsMetricsData();
            sorted = DataProcess.sortGlobal(this, sort_metric, report);
        }
        else if (report === "projects") {
            data = this.getProjectsMetricsData();
            sorted = DataProcess.sortGlobal(this, sort_metric, report);
        }
        else return;

        sorted = DataProcess.paginate(sorted, page);

        list += '<table class="table table-hover table-repositories">';
        list += '<tr><th></th>';
        $.each(metrics, function(id,metric){
            if (ds.getMetrics()[metric]){
                title = ds.getMetrics()[metric].name;
                list += '<th>' + title + '</th>';
            }
            else{
                list += '<th>' + metric + '</th>';
            }
        });
        list += '</tr>';
        $.each(sorted, function(id, item) {
            list += "<tr><td class='col-md-2 repository-name'>";
            list += "#" + cont + "&nbsp;";
            cont++;
            var addURL = null;
            if (Report.addDataDir()) addURL = Report.addDataDir();
            if (show_links) {
                var release_var = '';
                if (Utils.isReleasePage())
                    release_var = '&release=' + $.urlParam('release');

                if (report === "companies") {
                    list += "<a href='company.html?company="+item;
                    list += release_var;
                    if (addURL) list += "&"+addURL;
                    list += "'>";
                }
                else if (report === "repos") {
                    list += "<a href='";
                    list += "repository.html";
                    list += "?repository=" + encodeURIComponent(item);
                    list += release_var;
                    if (ds_realname){
                        list += "&ds=" + ds_realname;
                    }else{
                        list += "&ds=" + ds.getName();
                    }
                    if (addURL) list += "&"+addURL;
                    list += "'>";
                }
                else if (report === "countries") {
                    list += "<a href='country.html?country="+item;
                    list += release_var;
                    if (addURL) list += "&"+addURL;
                    list += "'>";
                }
                else if (report === "domains") {
                    list += "<a href='domain.html?domain="+item;
                    list += release_var;
                    if (addURL) list += "&"+addURL;
                    list += "'>";
                }
                else if (report === "projects") {
                    list += "<a href='project.html?project="+item;
                    list += release_var;
                    if (addURL) list += "&"+addURL;
                    list += "'>";
                }
            }
            list += "<strong>";
            list += Report.cleanLabel(item);
            list += "</strong>";
            if (show_links) list += "</a>";
            //list += "<br><a href='#nav'>^</a>";
            list += "</td>";

            var width = Math.floor(10/metrics.length);
            //we are not using the remainder!
            //var rem = 10 % metrics.length;
            //var first = false;

            $.each(metrics, function(id, metric) {
                var mywidth = width;
                /*if (first){
                    mywidth = width + rem;
                    first = false;
                }*/
                list += "<td class='col-md-" + mywidth + "'>";
                list += "<div id='"+report+"-"+item+"-"+metric+"'";
                list +=" class='subreport-list-item'>";
            });
            list += "</td></tr>";
        });
        list += "</table>";
        $("#"+div_id).append(list);
        // Draw the graphs
        var start_items = null, end_items = null, convert_items = null;
        if (start) {
            if (typeof start === "number") start_items = [start.toString()];
            else start_items = start.split(",");
        }
        if (end) {
            if (typeof end === "number") end_items = [end.toString()];
            else end_items = end.split(",");
        }
        if (convert) convert_items = convert.split(",");
        $.each(sorted, function(id, item) {
            var i = 0;
            $.each(metrics, function(id, metric) {
                var mstart = null, mend = null, mconvert = null;
                if (start_items) {
                    if (start_items.length == 1) mstart = start_items[0];
                    else mstart = start_items[i];
                }
                if (end_items) {
                    if (end_items.length == 1) mend = end_items[0];
                    else mend = end_items[i];
                }
                if (convert_items) mconvert = convert_items[i];
                if (item in data === false) return;
                var item_data = data[item];
                if (item_data[metric] === undefined) return;
                var div_id = report+"-"+item+"-"+metric;
                var items = {};
                items[item] = item_data;
                var title = '';
                Viz.displayMetricSubReportLines(div_id, metric, items, title,
                        config_metric, mstart , mend, mconvert);
                i++;
            });
        });
    };

    this.displayGlobalSummary = function(divid) {
        this.displaySummary(null, divid, null, this);
    };

    this.displayCompanySummary = function(divid, company, ds) {
        this.displaySummary("companies",divid, company, ds);
    };

    this.displayRepoSummary = function(divid, repo, ds, ds_realname) {
        this.displaySummary("repositories",divid, repo, ds, ds_realname);
    };

    this.displayCountrySummary = function(divid, repo, ds) {
        this.displaySummary("countries",divid, repo, ds);
    };

    this.displayDomainSummary = function(divid, domain, ds) {
        this.displaySummary("domains",divid, domain, ds);
    };

    this.displayProjectSummary = function(divid, project, ds) {
        this.displaySummary("projects",divid, project, ds);
    };

    this.displayPeopleSummary = function(divid, upeople_id,
            upeople_identifier, ds) {
        var history = ds.getPeopleGlobalData()[upeople_id];
        if (history === undefined || history instanceof Array) return;
        html = HTMLComposer.personSummaryTable(ds.getName(), history);
        $("#"+divid).append(html);
    };

    this.displayCompaniesSummary = function(divid, ds) {
        var html = "";
        var data = ds.getGlobalData();

        html += "Total companies: " + data.companies +"<br>";
        if (data.companies_2006)
            html += "Companies in 2006: " + data.companies_2006+"<br>";
        if (data.companies_2009)
            html += "Companies in 2009: " + data.companies_2009+"<br>";
        if (data.companies_2012)
            html += "Companies in 2012: " + data.companies_2012+"<br>";

        $("#"+divid).append(html);
    };

    // Return labels to be shown in the summary
    this.getSummaryLabels = function () {};

    this.getLabelForRepository = function(){
        return 'repository';
    };
    this.getLabelForRepositories = function(){
        return 'repositories';
    };


    this.displaySummary = function(report, divid, item, ds, ds_realname) {
        // Prints all the keys:values for an item
        if (!item) item = "";
        var html = "<h6>" + ds.getTitle()+ "</h6>";
        var id_label = this.getSummaryLabels();
        var global_data = null;
        if (report === "companies")
            global_data = ds.getCompaniesGlobalData()[item];
        else if (report === "countries")
            global_data = ds.getCountriesGlobalData()[item];
        else if (report === "repositories")
            global_data = ds.getReposGlobalData()[item];
        else if (report === "domains")
            global_data = ds.getDomainsGlobalData()[item];
        else if (report === "projects")
            global_data = ds.getProjectsGlobalData()[item];
        else global_data = ds.getGlobalData();

        if (!global_data) return;

        html = HTMLComposer.repositorySummaryTable(ds, global_data,
            id_label, ds_realname);
        $("#"+divid).append(html);
    };

    this.displayReposSummary = function(divid, ds) {
        var html = "";
        var data = ds.getGlobalData();
        html += "Total repositories: " + data[ds.getName()+"_repositories"] +"<br>";
        $("#"+divid).append(html);
    };

    this.displayCountriesSummary = function(divid, ds) {
      var html = "";
      var data = ds.getGlobalData();
      html += "Total countries: " + data[ds.getName()+"_countries"] +"<br>";
      $("#"+divid).append(html);
    };

    this.displayDomainsSummary = function(divid, ds) {
        var html = "";
        var data = ds.getGlobalData();
        html += "Total domains: " + data.domains +"<br>";
        $("#"+divid).append(html);
    };

    this.displayProjectsSummary = function(divid, ds) {
        var html = "";
        var data = ds.getGlobalData();
        html += "Total projects: " + data.projects +"<br>";
        $("#"+divid).append(html);
    };

    this.displayDemographics = function(divid, period) {
        var data = this.getDemographicsData();
        Viz.displayDemographicsChart(divid, data, period);
    };

    this.displayTimeToAttention = function(div_id, column, labels, title) {
        labels = true;
        title = "Time to Attention " + column;
        var data = this.getTimeToAttentionData();
        if (data instanceof Array) return;
        Viz.displayTimeToAttention(div_id, data, column, labels, title);
    };

    this.displayTimeToFix = function(div_id, column, labels, title) {
        labels = true;
        title = "Time to Fix " + column;
        var data = this.getTimeToFixData();
        if (data instanceof Array) return;
        Viz.displayTimeToFix(div_id, this.getTimeToFixData(), column, labels, title);
    };

    this.displayMarkovTable = function(div_id, title) {
        var data = this.getMarkovTableData();
        if (data === undefined) {
            Report.log ('No Markov data available');
            return;
        }
        Viz.displayMarkovTable(div_id, data, title);
    };

    this.displayTop = function(div, all, show_metric, period, period_all, graph, limit, people_links, threads_links, repository) {
        if (all === undefined) all = true;
        var titles = null;
        Viz.displayTop(div, this, all, show_metric, period, period_all, null, null, limit, people_links, threads_links, repository);
/*
        if ( (this.getName() == "mls") && (show_metric == "threads") ){
            Viz.displayTopThreads(div, this, all, show_metric, period, period_all, limit, people_links, threads_links);
        }else{
            Viz.displayTop(div, this, all, show_metric, period, period_all, graph, titles, limit, people_links);
        }*/
    };

    this.displayTopCompany = function(company, div, metric_id, period, titles, height, people_links) {
        var data = this.getCompaniesTopData()[company];
        if (data === undefined) return;
        var metric = this.getMetrics()[metric_id];

        Viz.displayTopCompany(this, company, data, div, metric_id, period, titles, height, people_links);
    };

    this.displayTopRepo = function(repo, div, metric_id, period, titles, height, people_links) {
        var data = this.getRepositoriesTopData()[repo];
        if (data === undefined) return;
        var metric = this.getMetrics()[metric_id];

        Viz.displayTopRepo(this, repo, data, div, metric_id, period, titles, height, people_links);
    };

    this.displayTopGlobal = function(div, metric, period, titles) {
        Viz.displayTopGlobal(div, this, metric, period, titles);
    };

    this.envisionEvo = function(div_id, history, relative, legend_show, summary_graph) {
        config = Report.getVizConfig();
        var options = Viz.getEnvisionOptions(div_id, history, this.getName(),
                Report.getVizConfig()[this.getName()+"_hide"], summary_graph);
        options.legend_show = legend_show;

        if (relative)
            DataProcess.addRelativeValues(options.data, this.getMainMetric());

        new envision.templates.Envision_Report(options, [ this ]);
    };

    this.displayEnvision = function(divid, relative, legend_show, summary_graph) {
        var projects_full_data = Report.getProjectsDataSources();

        this.envisionEvo(divid, projects_full_data, relative, legend_show, summary_graph);
    };
}
