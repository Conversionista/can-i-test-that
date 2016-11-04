# Conversionista's Experiment Feasibility Calculator a.k.a _Can I test that?_

So, how long should you run your A/B test?

There are 4 pieces of information that we need to know in order to answer that quesion:

- Conversion Rate of original page
- Number of variations to test (more variations you test, more traffic you need)
- Average daily traffic on your site (not really needed, optional)
- What % difference in conversion rate do you want to detect (if you want to detect even the slightest improvement, it will take much longer)

The last point is really, really hard to esitmate. So we buildt this tool.

![Distribution](https://s3.amazonaws.com/f.cl.ly/items/1p150D1B1f2V2o262Q0K/Image%202016-05-30%20at%207.51.42%20PM.png)

The graph above is taken from an excellent book called Statistical Rules of Thumb. Luckily, the [chapter on estimating sample size is available to download freely](http://www.vanbelle.org/chapters/webchapter2.pdf). Another excellent source to get more information on sample size estimation for A/B testing is Microsoft’s paper: [Controlled Experiments on the Web: Survey and Practical Guide](http://www.springerlink.com/content/r28m75k77u145115/fulltext.pdf).
