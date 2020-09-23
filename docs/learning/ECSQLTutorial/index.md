# 学习 ECSQL

通过本教程，您将学会如何使用 ECSQL 读取和查询 iModels 中的业务数据。

ECSQL 是 SQL 语言（一种被证明可靠的，被广泛应用的文本命令语言）的一个实现。它在任何情况下都遵循 SQL 标准规范（SQL-92 和 SQL-99）。

## 预备知识

### SQL

在本教程中，您会发现 ECSQL 与 SQL 极其相似。为了不再重新发明轮子，本教程希望您已经对 SQL 有基本的了解。**如果您刚刚接触 SQL，请学习有关 SQL 的基础课程。**

### iModelConsole

本教程是基于 **iModelConsole** 的。您需要按照教程的指引，在 iModelConsole 中执行 ECSQL 的例子。您也可以运行自己设计的 ECSQL 语句。

[访问 iModelConsole](https://imodelconsole.bentley.com/)

### iModel 实例

教程中的 ECSQL 例子使用一个名为 "House Sample" 的 iModel 实例。您可以在[这里](https://imodeljs.org/sample-showcase/)浏览更多 iModel 实例。

### BIS

The schemas for iModels are based on [BIS](../../bis/index.md). Therefore, the examples throughout the tutorial use the BIS schemas. While not required to learn ECSQL, familiarity with BIS is a good idea to get more from this tutorial.
iModel 的结构是基于[BIS](../../bis/index.md)的。

## Scope

The data in iModels can only be modified via the respective APIs. ECSQL is used to query the data from iModels. Therefore the tutorial only covers the query portion of ECSQL, i.e. **ECSQL SELECT** statements.

## How to use the tutorial

The tutorial looks at typical questions and finds the respective ECSQL answer to it. The goal of the tutorial is that you can try out all ECSQL statements used in the lessons yourself. The tool to run the ECSQL statements is the [iModelConsole](#imodelconsole) with the tutorial's [Sample iModel](#sample-imodel).

This also enables you to experiment more with ECSQL by modifying the tutorial's ECSQL statements or by trying out your own ECSQL statements.

### Step 1 - Start the iModelConsole

If you want to follow along with your own iModel:

1. Launch the console at https://imodelconsole.bentley.com
2. Authenticate with your iTwin credentials.
3. Open your iModel by clicking on the iModels in the table

### Step 2 - Open the sample iModel

For this ECSQL tutorial, the embedded console will attach to the sample iModel we provide.

### Step 3 - Run an ECSQL in the iModelConsole

Once you have opened your iModel, just type in the ECSQL and hit *Enter* to execute it.

Or simply use the provided sample below:

> **Try it yourself**
>
> *ECSQL*
> ```sql
> SELECT * FROM bis.Element
> ```

<iframe class="embedded-console" src="/console/?imodel=House Sample&query=SELECT * FROM bis.Element"></iframe>

## Tutorial Overview

* [Lesson 1: Key to ECSQL](./KeyToECSQL.md)
* [Lesson 2: The first examples](./FirstExamples.md)
* [Lesson 3: ECSQL Data Types](./ECSQLDataTypes.md)
* [Lesson 4: Relationships and Joins](./Joins.md)
* [Lesson 5: Class Polymorphism](./PolymorphicQueries.md)
* [Lesson 6: Spatial Queries](./SpatialQueries.md)
* [Lesson 7: Meta Queries - Querying ECSchemas](./MetaQueries.md)
* [Lesson 8: Querying Change Summaries](./ChangeSummaryQueries.md)
* [Lesson 9: Type Filter](./TypeFilter.md)
* [Lesson 10: Conditional Expressions](./ConditionalExpr.md)
* [Lesson 11: Built-In functions](./BuiltInFunctions.md)

---

[**Next >**](./KeyToECSQL.md)
