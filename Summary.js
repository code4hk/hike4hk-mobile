/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
} = React;

var Summary = React.createClass({
  render: function() {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.imagePane}>
          <Image 
            source={{uri:"http://wisedesigning.com/wp-content/uploads/2014/09/1.png"}}
            style={styles.detailsImage} />
        </View>
        <Text style={styles.movieTitle}>CompanyAwesome</Text>
        <Text style={styles.ratingTitle}>just donated</Text>
        <Text style={styles.movieTitle}>{this.props.calories} calories</Text>
        <Text style={styles.ratingTitle}>on your behalf!</Text>
      </View>
    );
  },
});


var styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'column',
    paddingVertical: 150,
    paddingHorizontal: 30,
    justifyContent: "center",
    textAlign: "center"
  },
  imagePane: {
    justifyContent: 'space-around',
    textAlign: "center"
  },
  movieTitle: {
    flex: 1,
    padding: 20,
    fontSize: 24,
    fontWeight: '500',
    textAlign: "center"
  },
  rating: {
    marginTop: 10,
  },
  ratingTitle: {
    textAlign: "center",
    padding: 10,
    fontSize: 20,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '500',
  },
  mpaaWrapper: {
    alignSelf: 'flex-start',
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 3,
    marginVertical: 5,
  },
  mpaaText: {
    fontFamily: 'Palatino',
    fontSize: 13,
    fontWeight: '500',
  },
  mainSection: {
    flexDirection: 'row',
  },
  detailsImage: {
    width: 200,
    height: 200,
    alignSelf: "center"
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },
  castTitle: {
    fontWeight: '500',
    marginBottom: 3,
  },
  castActor: {
    marginLeft: 2,
  },
});

module.exports = Summary;
