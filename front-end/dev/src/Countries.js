import React from 'react';

import NavMain from './NavMain';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var axios = require('axios');

class Countries extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        open: true,
        model: [],
        pages: null,
        loading: true,
        type: "country",
        typeProper: "Countries",
        subTitle: "Dive into rich ecosystems"
    };
    this.instanceFormatter  = this.instanceFormatter.bind(this);
    this.animalFormatter    = this.animalFormatter.bind(this);
    this.habitatFormatter   = this.habitatFormatter.bind(this);
    this.threatFormatter    = this.threatFormatter.bind(this);

    var that = this;
    axios.create({
      baseURL: 'https://swe-endangered-animals.appspot.com/',
      headers: {"Access-Control-Allow-Origin": "*"}
    }).get('/all_'+this.state.type+'_data')
      .then(function(data) {
        that.setState({
          model: data.data
        });
    });
  };

  shouldComponentUpdate() {
    return true;
  };


  changeURL(type, data){
    if(typeof data == "undefined")
      data = "";
    this.context.router.push("/"+type+".html/?q="+data);
  };

  highlight(data) {
    var item = document.querySelector('.form-group.form-group-sm.react-bs-table-search-form>input');
    if (item && item.value && data) {
      var keyword = item.value;
      var regex = new RegExp(keyword, 'ig');
      return {__html: data.replace(regex, function(match){ return '<b><u>' + match + '</u></b>' }) }
    }
    return {__html: data}
  };

  animalFormatter(list){
    var type = "animal";

    var links = list.map(function(x, i){
      return ( <li key={type+x+i}> { this.instanceFormatter(x, null, type) } </li> );
    }.bind(this));

    return (
      <div>
        <ul>
          { links }
        </ul>
      </div>
    );
  };

  habitatFormatter(list){
    var type = "habitat";
    
    var links = list.map(function(x, i){
      return ( <li key={type+x+i}> { this.instanceFormatter(x, null, type) } </li> );
    }.bind(this));

    return (
      <div>
        <ul>
          { links }
        </ul>
      </div>
    );
  };

  imageFormatter(data){
    return <img src={ data } height="250px" width="250px" />;
  };

  instanceFormatter(data, row, type){
    if(typeof type == "undefined")
      type = this.state.type;
    return <a onClick={ () => { this.changeURL(type, data) } } dangerouslySetInnerHTML={this.highlight(data)}></a>;
  };

  mapFormatter(name){
    return (
      <iframe id="gmap_canvas" width="100%" src={ "https://maps.google.com/maps?q=" + name + "&t=k&z=6&ie=UTF8&iwloc=&output=embed" } frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0">
      </iframe>
    );
  };

  threatFormatter(list){
    var type = "threat";
    
    var links = list.map(function(x, i){
      return ( <li key={type+x+i}> { this.instanceFormatter(x, null, type) } </li> );
    }.bind(this));

    return (
      <div>
        <ul>
          { links }
        </ul>
      </div>
    );
  };

  render() {
    const options = {
      page: 1,      
      sizePerPageList: [ {
        text: '10', value: 10
      }, {
        text: '20', value: 20
      }, {
        text: '30', value: 30
      } ], 
      sizePerPage: 10,  
      pageStartIndex: 1, 
      paginationSize: 5,  
      prePage: 'Prev', 
      nextPage: 'Next', 
      firstPage: 'First', 
      lastPage: 'Last', 
      paginationShowsTotal: this.renderShowsTotal,  
      paginationPosition: 'top' 
    };

    if(!this.state.model.length)
      return ( <div /> )

    return (
      <div>
        <NavMain activePage={this.state.type} />

         <PageHeader
          title={this.state.typeProper}
          subTitle={this.state.subTitle}/>

           <BootstrapTable data={this.state.model} striped={true} hover={true} ref='table' pagination={true} search={true} columnFilter={true} options={options}>
            <TableHeaderColumn width='200' dataField="flag"             dataAlign="center"                                dataFormat={this.imageFormatter}    > Image                </TableHeaderColumn>
            <TableHeaderColumn width='200' dataField="name"             dataAlign="center" dataSort={true} isKey={true}   dataFormat={this.instanceFormatter} > Name                 </TableHeaderColumn>
            <TableHeaderColumn width='200' dataField="assoc_animals"    dataAlign="left"                                  dataFormat={this.animalFormatter}   > Associated Animals   </TableHeaderColumn>
            <TableHeaderColumn width='200' dataField="assoc_habitats"   dataAlign="left"                                  dataFormat={this.habitatFormatter}  > Associated Habitats  </TableHeaderColumn>
            <TableHeaderColumn width='200' dataField="name"             dataAlign="center"                                dataFormat={this.mapFormatter}      > Map                  </TableHeaderColumn>
          </BootstrapTable>

        <PageFooter />
      </div>
  );
  }
}

Countries.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Countries;
