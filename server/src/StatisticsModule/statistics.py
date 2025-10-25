import pandas as pd
import plotly.express as px

def chart_bar(df, columns: list, name_chart: str):
    flg = px.bar(
        df,
        x=columns[0],
        y=columns[1],
        title=name_chart,
        color=columns[0]
    )

    flg.update_xaxes(
        tickmode="array",
        tickvals=df[columns[0]],
        ticktext=df[columns[0]],
        tickangle=0
    )

    # flg.show()

    # flg.write_html("chart.html")
    return flg.to_html()


def skils_statistics(skills: list):
    '''
    Статистика компетенций в компании
    '''
    skill_names = [item['skill_shape']['skill_name'] for item in skills]
    df = pd.Series(skill_names).value_counts().reset_index()

    columns = ['Навыки', 'Количество']

    df.columns = columns

    return chart_bar(df, columns, "Статистика компетенций")


def competence_statistics(skills: list):
    '''
    Статистика уровней компетенций в компании
    '''
    skill_levels = [item['skill_level'] for item in skills]
    df = pd.Series(skill_levels).value_counts().reset_index()

    columns = ["Уровень компетенции", "Количество"]

    df.columns = columns

    return chart_bar(df, columns, "Статистика компетенций")


def interview_months_statistics(interviews: list):
    '''
    Статистика собеседований по месяцам
    '''
    interview_date = [item['interview_date'].strftime("%B, %Y") for item in interviews]
    df = pd.Series(interview_date).value_counts().reset_index()

    columns = ["Дата", "Количество"]

    df.columns = columns

    return chart_bar(df, columns, "Статистика собеседований")


def interview_statistics(interview_types: list):
    '''
    Статистика собеседований по типу собеседований
    '''
    interview_stat = [item['InterviewType'] for item in interview_types]
    df = pd.Series(interview_stat).value_counts().reset_index()

    columns = ["Тип собеседования", "Количество"]

    df.columns = columns

    return chart_bar(df, columns, "Статистика собеседований")


def interview_completion_statistics(interview_completions: list):
    '''
    Статистику интервью по типу выполнения
    '''
    interview_compl = [item['interview_status'] for item in interview_completions]
    df = pd.Series(interview_compl).value_counts().reset_index()

    columns = ["Тип выполнения", "Количество"]

    df.columns = columns

    return chart_bar(df, columns, "Статистика интервью")


def interview_role_statistics(interview_roles:list):
    '''
    Статистика по ролям в компании
    '''
    interview_role = [item['role_name'] for item in interview_roles]
    df = pd.Series(interview_role).value_counts().reset_index()

    columns = ["Роли", "Количество"]

    df.columns = columns

    return chart_bar(df, columns, "Статистика ролей")